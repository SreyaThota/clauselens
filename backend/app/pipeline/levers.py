from __future__ import annotations
from typing import Dict, List
from .schemas import ExtractedField, NegotiationLever

def generate_negotiation_levers(fields: Dict[str, ExtractedField]) -> List[NegotiationLever]:
    """
    Generates rule-based commercial negotiation levers based on extracted terms.
    These are heuristic suggestions, clearly labeled as rule-based recommendations, not legal advice.
    """
    levers: List[NegotiationLever] = []
    
    # 1. Payment terms lever
    payment = fields.get("payment_terms")
    if payment and payment.status in ("verified", "needs_review") and payment.normalized:
        try:
            days = int(payment.normalized)
            if days <= 30:
                levers.append(NegotiationLever(
                    id="lever-payment-terms",
                    field_name="payment_terms",
                    title="Optimize Working Capital (Payment Terms)",
                    current_term=f"Net {days} days",
                    recommendation="Negotiate Net 60 or Net 90 payment terms with 1.5% prompt payment discount.",
                    rationale=(
                        f"Current term is Net {days}. Extending to Net 60 preserves cash flow and aligns with "
                        "standard enterprise procurement benchmarks without disrupting supplier operations."
                    ),
                    impact="high"
                ))
            elif days >= 90:
                levers.append(NegotiationLever(
                    id="lever-payment-terms",
                    field_name="payment_terms",
                    title="Supplier Relationship Health",
                    current_term=f"Net {days} days",
                    recommendation="Evaluate supplier solvency risks or negotiate volume tiers in exchange for Net 60.",
                    rationale="Excessively extended terms (>90 days) may lead to supplier surcharges or hidden financing costs.",
                    impact="medium"
                ))
        except (ValueError, TypeError):
            pass

    # 2. Price adjustment lever
    price_adj = fields.get("price_adjustment")
    if price_adj and price_adj.status in ("verified", "needs_review"):
        norm = str(price_adj.normalized).lower()
        if norm == "index-linked":
            levers.append(NegotiationLever(
                id="lever-price-adjustment",
                field_name="price_adjustment",
                title="Cap Index-Linked Price Escalations",
                current_term="Index-linked price adjustment",
                recommendation="Add an annual collar/cap (e.g., lower of CPI or 3.0% maximum per annum).",
                rationale=(
                    "Uncapped index-linked adjustments expose the organisation to runaway inflationary budget creep. "
                    "A defined annual ceiling establishes budgetary predictability."
                ),
                impact="high"
            ))
        elif norm == "renegotiable":
            levers.append(NegotiationLever(
                id="lever-price-adjustment",
                field_name="price_adjustment",
                title="Formalize Renegotiation Triggers",
                current_term="Subject to renegotiation / mutual agreement",
                recommendation="Include minimum 90-day advance notice for price revisions and termination rights if agreement is not reached.",
                rationale=(
                    "Vague renegotiation clauses create hold-up problems where the vendor requests an increase "
                    "close to renewal when switching costs are highest."
                ),
                impact="medium"
            ))

    # 3. Liability cap lever
    liability = fields.get("liability_cap")
    if liability and liability.status in ("verified", "needs_review"):
        norm_l = str(liability.normalized).lower()
        if "uncapped" in norm_l or norm_l == "none found":
            levers.append(NegotiationLever(
                id="lever-liability-cap",
                field_name="liability_cap",
                title="Institute Aggregate Liability Ceiling",
                current_term=str(liability.value or "Uncapped / Silent"),
                recommendation="Cap aggregate vendor and buyer liability at 12 months' trailing fees paid or fixed $1M ceiling.",
                rationale=(
                    "Uncapped liability or ambiguous limits represent an unquantified balance sheet risk during audits "
                    "and vendor security incidents."
                ),
                impact="high"
            ))

    # 4. Auto-renewal lever
    renewal = fields.get("auto_renewal")
    notice = fields.get("termination_notice")
    if renewal and renewal.status in ("verified", "needs_review"):
        norm_r = str(renewal.normalized).lower()
        if "true" in norm_r:
            notice_val = notice.normalized if (notice and notice.normalized) else "standard"
            levers.append(NegotiationLever(
                id="lever-auto-renewal",
                field_name="auto_renewal",
                title="Auto-Renewal Trap Mitigation",
                current_term=f"Auto-renews; Termination notice: {notice_val}",
                recommendation="Require explicit affirmative notice before renewal, or expand termination opt-out window to 60 days.",
                rationale=(
                    "Evergreen auto-renewal clauses lock procurement teams into obsolete pricing and unused licenses "
                    "if missed during quarterly contract reviews."
                ),
                impact="medium"
            ))

    # Fallback lever if fewer than 2 levers were generated
    if len(levers) < 2:
        gov = fields.get("governing_law")
        if gov and gov.status in ("verified", "needs_review"):
            levers.append(NegotiationLever(
                id="lever-governing-law",
                field_name="governing_law",
                title="Jurisdiction Harmonization",
                current_term=str(gov.normalized or gov.value),
                recommendation="Harmonize governing law to buyer's standard operating jurisdiction.",
                rationale="Foreign or distant jurisdictions dramatically increase dispute resolution expenses and require local counsel retention.",
                impact="low"
            ))

    return levers[:3]

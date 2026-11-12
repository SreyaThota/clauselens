import { MOCK_SAMPLES } from '../../../lib/mockData';
import ResultsClient from './ResultsClient';

export function generateStaticParams() {
  const fullIds = MOCK_SAMPLES.map((s) => ({ id: s.id }));
  const shortIds = MOCK_SAMPLES.map((s) => ({
    id: s.id.split('_').slice(0, 2).join('_'),
  }));
  return [...fullIds, ...shortIds];
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResultsClient contractId={id} />;
}

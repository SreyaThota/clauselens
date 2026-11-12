import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClauseLens",
  description: "Contract terms you can verify. Extracts 8 commercial terms and checks every one against the source page.",
  icons: {
    icon: "/clauselens/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/clauselens/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-[#F1F5F9] text-[#0F172A] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

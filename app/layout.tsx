import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MD Export | Markdown to PDF Converter',
  description: 'Convert your Markdown to beautiful PDFs with real-time preview',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="transition-colors duration-200">{children}</body>
    </html>
  );
}

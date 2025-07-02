import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { getMetadata } from '@/lib/get-metadata';
import { routes } from '@/lib/routes';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export function generateMetadata(): Metadata {
  return getMetadata(routes.home());
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
    </html>
  );
}

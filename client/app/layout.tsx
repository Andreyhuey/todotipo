import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import { Inter, Montserrat } from 'next/font/google';
import Navbar from '@/components/nav-bar';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { getMetadata } from '@/lib/get-metadata';
import { routes } from '@/lib/routes';
import Canonical from '@/components/canonical';

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
      <head></head>
      <body className={` ${inter.variable} ${montserrat.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Canonical />
          <Footer />
        </Providers>
        <Toaster position="top-right" expand richColors />
      </body>
    </html>
  );
}

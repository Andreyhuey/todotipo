import type { Metadata } from 'next';
import { getMetadata } from '@/lib/get-metadata';
import { routes } from '@/lib/routes';

export function generateMetadata(): Metadata {
  return getMetadata(routes.home());
}

export default function RootLayout() {
  return (
    <html lang="en">
      
    </html>
  );
}

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden bg-forest-900 pt-24">
      <p
        aria-hidden
        className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-display text-[42vw] font-light leading-none text-white/[0.04]"
      >
        404
      </p>
      <div className="container relative flex max-w-2xl flex-col items-start gap-6">
        <span className="eyebrow text-oak-300">Error 404</span>
        <h1 className="display-1 text-linen">This page has wandered off.</h1>
        <p className="lead text-linen/70">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on solid ground.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild size="lg" variant="oak">
            <Link href={routes.home()}>
              <ArrowLeft /> Back to home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outlineLight">
            <Link href={routes.products()}>Browse products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

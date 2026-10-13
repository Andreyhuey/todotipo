'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[80svh] items-center bg-linen pt-24">
      <div className="container flex max-w-xl flex-col items-start gap-5">
        <span className="eyebrow">Something went wrong</span>
        <h1 className="display-2">We couldn&apos;t load this page.</h1>
        <p className="lead">This is usually temporary. Please try again in a moment.</p>
        <Button onClick={reset} size="lg">
          <RotateCcw /> Try again
        </Button>
      </div>
    </section>
  );
}

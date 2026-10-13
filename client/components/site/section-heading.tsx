import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  tone = 'dark',
  action,
  className,
}: Props) {
  const light = tone === 'light';
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className
      )}
    >
      <div className={cn('flex max-w-2xl flex-col gap-4', align === 'center' && 'items-center')}>
        {eyebrow && <span className={cn('eyebrow', light && 'text-oak-300')}>{eyebrow}</span>}
        <h2 className={cn('display-2 text-balance', light && 'text-linen')}>{title}</h2>
        {subtitle && (
          <p className={cn('lead max-w-xl', light && 'text-linen/70')}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

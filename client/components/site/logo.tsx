import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  /** Uploaded logo for light backgrounds. */
  logo?: string;
  /** Uploaded logo for dark backgrounds. */
  logoLight?: string;
  tone?: 'dark' | 'light';
  className?: string;
}

/** Uses the uploaded logo when set, otherwise a typographic wordmark. */
export default function Logo({ name, logo, logoLight, tone = 'dark', className }: Props) {
  const src = tone === 'light' ? logoLight || logo : logo || logoLight;

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={160}
        height={48}
        priority
        className={cn('h-9 w-auto object-contain md:h-10', className)}
      />
    );
  }

  return (
    <span
      className={cn(
        'font-display text-[1.7rem] font-normal leading-none tracking-tight',
        tone === 'light' ? 'text-linen' : 'text-ink',
        className
      )}
    >
      {name}
      <span className="text-oak-400">.</span>
    </span>
  );
}

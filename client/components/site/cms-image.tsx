import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
  /** Classes for the placeholder shown when the CMS has no image set. */
  placeholderClassName?: string;
};

/**
 * Renders an image uploaded through the admin media library. When a slot has
 * no image yet, a neutral wood-grain placeholder keeps the layout intact.
 */
export default function CmsImage({ src, alt, className, placeholderClassName, fill, ...rest }: Props) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          'placeholder-grain',
          fill ? 'absolute inset-0' : 'h-full w-full',
          placeholderClassName
        )}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      {...(!fill && !rest.width ? { width: 1600, height: 1000 } : {})}
      {...rest}
    />
  );
}

import { cn } from '@/lib/utils';

interface Props {
  fullPage?: boolean;
  className?: string;
}

const Loader = ({ fullPage, className }: Props) => (
  <div
    role="status"
    aria-label="Loading"
    className={cn('flex items-center justify-center', fullPage && 'min-h-screen bg-linen', className)}
  >
    <span className="size-10 animate-spin rounded-full border-2 border-oak-200 border-t-oak-600" />
  </div>
);

export default Loader;

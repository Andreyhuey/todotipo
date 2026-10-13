import {
  BadgeCheck,
  Bug,
  CloudSun,
  Droplets,
  Flame,
  Hammer,
  Heart,
  Leaf,
  Lightbulb,
  LucideProps,
  Palette,
  PiggyBank,
  Recycle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Sun,
  Timer,
  Trees,
  Truck,
  Users,
  Zap,
} from 'lucide-react';

/** Icons selectable in the admin for feature / value lists. */
export const iconMap = {
  leaf: Leaf,
  'cloud-sun': CloudSun,
  sparkles: Sparkles,
  palette: Palette,
  'piggy-bank': PiggyBank,
  zap: Zap,
  'badge-check': BadgeCheck,
  lightbulb: Lightbulb,
  'shield-check': ShieldCheck,
  users: Users,
  heart: Heart,
  droplets: Droplets,
  flame: Flame,
  bug: Bug,
  recycle: Recycle,
  ruler: Ruler,
  hammer: Hammer,
  timer: Timer,
  sun: Sun,
  trees: Trees,
  truck: Truck,
} as const;

export const iconNames = Object.keys(iconMap) as (keyof typeof iconMap)[];

export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = iconMap[name as keyof typeof iconMap] ?? Leaf;
  return <Cmp strokeWidth={1.5} {...props} />;
}

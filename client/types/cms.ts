export interface Cta {
  label: string;
  href: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  email: string;
  notifyEmail?: string;
  phone: string;
  address: string;
  hours: string;
  logo: string;
  logoLight: string;
  favicon: string;
  ogImage: string;
  footerBlurb: string;
  socials: {
    instagram: string;
    facebook: string;
    linkedin: string;
    x: string;
    youtube: string;
  };
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string[];
}

export interface IconItem {
  icon: string;
  title: string;
  body: string;
  image?: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface HomeSettings {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: Cta;
    secondaryCta: Cta;
    slides: { image: string; caption: string }[];
  };
  stats: StatItem[];
  intro: { eyebrow: string; title: string; body: string; image: string };
  whyUs: { title: string; subtitle: string; items: IconItem[] };
  testimonials: Testimonial[];
  cta: { title: string; body: string; buttonLabel: string; image: string };
}

export interface PageHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface AboutSettings {
  hero: PageHero;
  intro: string[];
  story: { title: string; paragraphs: string[]; image: string };
  mission: string;
  vision: string;
  values: IconItem[];
  sustainability: {
    title: string;
    body: string;
    image: string;
    items: StatItem[];
  };
}

export interface PagesSettings {
  products: PageHero;
  designCases: PageHero;
  contact: PageHero;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
}

export interface LegalSettings {
  updatedAt: string;
  privacy: string;
  terms: string;
}

export interface AllSettings {
  site: SiteSettings;
  seo: SeoSettings;
  home: HomeSettings;
  about: AboutSettings;
  pages: PagesSettings;
  legal: LegalSettings;
}

export interface SiteData extends AllSettings {
  categories: Category[];
}

export interface SpecRow {
  name: string;
  value: string;
}

export interface BlockItem {
  image: string;
  name?: string;
}

export type BlockType = 'gallery' | 'swatches' | 'features' | 'specs';

export interface ContentBlock {
  type: BlockType;
  title?: string;
  columns?: number;
  items?: BlockItem[];
  specs?: SpecRow[];
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  brand: string;
  model: string;
  code: string;
  image: string;
  seoImage: string;
  gallery: string[];
  description: string[];
  video: string;
  specifications: SpecRow[];
  blocks: ContentBlock[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  updatedAt?: string;
}

export interface DesignCase {
  id: number;
  name: string;
  slug: string;
  overview: string;
  description: string;
  location: string;
  tags: string[];
  highlights: string[];
  audience: string[];
  coverImage: string;
  images: string[];
  seoImage: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  updatedAt?: string;
}

export interface Media {
  id: number;
  url: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  folder: string;
  createdAt: string;
}

export interface Inquiry {
  id: number;
  type: 'contact' | 'quote';
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  meta: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ---- analytics ----------------------------------------------------------------

export interface Visit {
  id: number;
  visitorId: string;
  sessionId: string;
  path: string;
  title: string;
  referrer: string;
  referrerHost: string;
  ip: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  screen: string;
  language: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  isp: string;
  timezone: string;
  duration: number | null;
  createdAt: string;
}

/** One row of the visit log: a visitor's activity within the selected range. */
export interface VisitorSummary
  extends Pick<Visit, 'visitorId' | 'referrerHost' | 'city' | 'region' | 'country' | 'countryCode' | 'device' | 'browser' | 'os'> {
  views: number;
  pages: number;
  /** Total time on page, seconds. */
  duration: number;
  firstSeen: string;
  lastSeen: string;
  landingPage: string;
}

export interface AnalyticsKpis {
  pageViews: number;
  visitors: number;
  sessions: number;
  bounceRate: number;
  avgDuration: number;
}

export interface CountItem {
  name: string;
  count: number;
  label?: string;
}

export interface AnalyticsSummary {
  range: string;
  granularity: 'hour' | 'day';
  live: number;
  totals: AnalyticsKpis;
  previous: AnalyticsKpis;
  series: { t: string; views: number; visitors: number }[];
  pages: CountItem[];
  countries: CountItem[];
  cities: CountItem[];
  referrers: CountItem[];
  devices: CountItem[];
  browsers: CountItem[];
  os: CountItem[];
  unlocated: number;
}

// ---- activity log -------------------------------------------------------------

export type LogLevel = 'info' | 'warning' | 'error';
export type LogCategory = 'auth' | 'security' | 'content' | 'media' | 'settings' | 'users' | 'inbox' | 'system';

export interface ActivityLog {
  id: number;
  createdAt: string;
  level: LogLevel;
  category: LogCategory;
  action: string;
  message: string;
  actorType: 'admin' | 'visitor' | 'system';
  actorId: number | null;
  actorEmail: string;
  ip: string;
  userAgent: string;
  targetType: string;
  targetId: string;
  targetLabel: string;
  meta: Record<string, unknown>;
}

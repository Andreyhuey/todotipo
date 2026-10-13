import { AppDataSource } from '../config/database';
import { Setting } from '../entity/Setting';

/**
 * Editable site content. Image fields hold URLs of files uploaded through the
 * admin media library — the public site ships no content images of its own.
 */
export const defaultSettings = {
  site: {
    name: 'Oaken',
    tagline: 'Premium composite building materials',
    email: '',
    notifyEmail: '',
    phone: '',
    address: '',
    hours: 'Mon – Fri, 9:00 – 17:00',
    logo: '',
    logoLight: '',
    favicon: '',
    ogImage: '',
    footerBlurb:
      'Sustainable wood-plastic composite decking, cladding, wall panels and doors — engineered to look beautiful and last for decades.',
    socials: {
      instagram: '',
      facebook: '',
      linkedin: '',
      x: '',
      youtube: '',
    },
  },
  seo: {
    title: 'Oaken — Premium Composite Building Materials',
    description:
      'Oaken supplies premium, eco-friendly wood-plastic composite (WPC) decking, wall panels, cladding, doors and fencing for builders, architects and homeowners.',
    keywords: [
      'WPC decking',
      'composite decking',
      'wall panels',
      'composite cladding',
      'sustainable building materials',
      'composite doors',
      'composite fencing',
    ],
  },
  home: {
    hero: {
      eyebrow: 'Modern · Minimal · Sustainable',
      title: 'Building materials crafted for spaces that last',
      subtitle:
        'Premium wood-plastic composites that pair the warmth of natural timber with the durability modern architecture demands.',
      primaryCta: { label: 'Request a quote', href: '/contact-us' },
      secondaryCta: { label: 'Explore products', href: '/products' },
      slides: [] as { image: string; caption: string }[],
    },
    stats: [
      { value: '95%', label: 'Recycled content' },
      { value: '10 yr', label: 'Product warranty' },
      { value: '21 days', label: 'Typical delivery' },
      { value: '0', label: 'Sealing or staining needed' },
    ],
    intro: {
      eyebrow: 'Who we are',
      title: 'Natural character. Engineered performance.',
      body: 'At Oaken we equip builders, architects and homeowners with premium building materials and eco-friendly wood-plastic composite (WPC) solutions. From gap-free decking to fluted wall panels, our products blend strength, sustainability and design so your projects look exceptional for decades — not just on handover day.',
      image: '',
    },
    whyUs: {
      title: 'Why builders choose Oaken',
      subtitle:
        'The advantages that make our materials stand out on site and long after.',
      items: [
        {
          icon: 'leaf',
          title: 'Eco-friendly',
          body: 'Made from recycled wood fibres and polymers, reducing environmental impact without compromising quality.',
        },
        {
          icon: 'cloud-sun',
          title: 'Weather resistant',
          body: 'Engineered to withstand sun, frost and moisture while keeping its look and structural integrity.',
        },
        {
          icon: 'sparkles',
          title: 'Low maintenance',
          body: 'No sanding, sealing or staining. A simple wash keeps surfaces looking new year after year.',
        },
        {
          icon: 'palette',
          title: 'Customisable',
          body: 'A broad range of colours, textures and finishes to match any design vision.',
        },
        {
          icon: 'piggy-bank',
          title: 'Cost effective',
          body: 'Lower lifetime cost than timber thanks to durability and minimal upkeep.',
        },
        {
          icon: 'zap',
          title: 'Fast installation',
          body: 'Hidden-fastener and tongue-and-groove systems cut labour time on site.',
        },
      ],
    },
    testimonials: [] as { quote: string; author: string; role: string }[],
    cta: {
      title: 'Have a project in mind?',
      body: 'Tell us about your space and our team will recommend the right materials, finishes and quantities — with a free, no-obligation quote.',
      buttonLabel: 'Get a free quote',
      image: '',
    },
  },
  about: {
    hero: {
      eyebrow: 'About us',
      title: 'Shaping spaces that endure',
      subtitle:
        'We manufacture and supply eco-friendly WPC and SPC materials — innovative, sustainable building solutions designed to outlast traditional timber.',
      image: '',
    },
    intro: [
      'We are a manufacturer and supplier of eco-friendly WPC and SPC materials, dedicated to crafting innovative, sustainable building solutions. Our R&D capabilities drive the development of high-quality products — from composite decking and wall panels to doors and fencing — offering durable, stylish alternatives to traditional wood.',
      'With a network of professional teams, we provide comprehensive services including customised design, production and international logistics. Our products serve contractors, architects, homeowners and businesses with tailored solutions that blend creativity, functionality and sustainability.',
    ],
    story: {
      title: 'Our story',
      paragraphs: [
        'We began with a simple idea: to build better, greener spaces. Our passion for sustainability drove us to pioneer wood-plastic composite solutions that blend durability with eco-conscious design. From our first backyard deck to supplying architects with innovative cladding, we have grown into a trusted partner for contractors, architects and homeowners.',
        'Every product reflects our commitment to quality and the planet. We source responsibly, innovate relentlessly and listen to our clients. Today Oaken stands for spaces that last, inspire, and tread lightly on the earth — one project at a time.',
      ],
      image: '',
    },
    mission:
      'To empower builders and dreamers with sustainable, high-quality materials that transform spaces responsibly — ensuring durability, style and environmental care in every project.',
    vision:
      'To lead the way in sustainable construction, making eco-conscious design accessible and inspiring for contractors, architects and homeowners.',
    values: [
      {
        icon: 'leaf',
        title: 'Sustainability',
        body: 'Eco-friendly materials and practices that reduce environmental impact while delivering lasting solutions.',
        image: '',
      },
      {
        icon: 'badge-check',
        title: 'Quality',
        body: 'Durable, stylish products that meet the highest standards, earning trust and satisfaction.',
        image: '',
      },
      {
        icon: 'lightbulb',
        title: 'Innovation',
        body: 'Cutting-edge technology to create versatile, forward-thinking building materials.',
        image: '',
      },
      {
        icon: 'shield-check',
        title: 'Integrity',
        body: 'Honesty and reliability that build strong relationships with clients and partners.',
        image: '',
      },
      {
        icon: 'users',
        title: 'Community',
        body: 'Supporting the communities we serve and creating spaces that bring people together.',
        image: '',
      },
      {
        icon: 'heart',
        title: 'Customer focus',
        body: 'Listening closely and delivering tailored solutions that bring each vision to life.',
        image: '',
      },
    ],
    sustainability: {
      title: 'Building a greener future',
      body: "Sustainability isn't a buzzword for us — it's our foundation. We develop materials that perform exceptionally while minimising environmental impact across their lifecycle, from recycled inputs to energy-efficient manufacturing.",
      image: '',
      items: [
        { value: '95%', label: 'Recycled content in our WPC products' },
        { value: 'Closed-loop', label: 'Water systems in manufacturing' },
        { value: '80%', label: 'Production powered by renewables' },
        { value: '30%', label: 'Lower carbon footprint than timber' },
      ],
    },
  },
  legal: {
    updatedAt: '',
    // Plain text; blank lines separate paragraphs, "## " starts a heading.
    privacy: `This policy explains how we collect, use and protect personal information when you visit our website or contact us.

## Information we collect
When you submit a contact form, request a quote or subscribe to our newsletter we collect the details you provide, such as your name, email address, phone number, address and project information.

## Website analytics
When you browse this site we record the pages you visit, how long you stay, your browser and device type, the referring website, and your IP address. We use the IP address to estimate your approximate location (city and country) through a geolocation provider. This helps us understand which products and regions interest our visitors. We do not use this information to identify you personally.

## How we use it
We use this information to respond to enquiries, prepare quotes, deliver orders and, if you subscribed, send occasional updates. You can unsubscribe at any time.

## Sharing
We do not sell your personal information. We only share it with service providers who help us operate our business (for example email and hosting providers), under appropriate confidentiality obligations.

## Your rights
You may request access to, correction of, or deletion of your personal information by contacting us.

## Contact
Questions about this policy can be sent to us using the details on our contact page.`,
    terms: `By using this website you agree to these terms.

## Product information
We make every effort to ensure product descriptions, specifications and images are accurate. Colours and textures may vary slightly from what is shown on screen. Specifications may change without notice.

## Quotes and orders
Quotes are estimates based on the information you provide and are valid for the period stated on the quote. Orders are subject to availability and confirmation.

## Intellectual property
All content on this site, including text, images and logos, is owned by us or our licensors and may not be reused without permission.

## Limitation of liability
This website is provided "as is". To the extent permitted by law we are not liable for any loss arising from its use.

## Changes
We may update these terms from time to time. Continued use of the site means you accept the current terms.`,
  },
  pages: {
    products: {
      eyebrow: 'Our products',
      title: 'Materials for every surface',
      subtitle:
        'Decking, fluted panels, wall systems, doors and fencing — all engineered from sustainable composites.',
      image: '',
    },
    designCases: {
      eyebrow: 'Design cases',
      title: 'Projects built with Oaken',
      subtitle:
        'See how architects, builders and homeowners transform spaces with durable, eco-friendly materials.',
      image: '',
    },
    contact: {
      eyebrow: 'Contact',
      title: "Let's talk about your project",
      subtitle:
        'Questions about products, samples or pricing? Our specialists usually reply within one business day.',
      image: '',
    },
  },
};

export type SettingsKey = keyof typeof defaultSettings;
export const settingsKeys = Object.keys(defaultSettings) as SettingsKey[];

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** Deep-merge stored values over defaults so new fields appear automatically. */
const mergeDefaults = (base: unknown, stored: unknown): unknown => {
  if (stored === undefined || stored === null) return base;
  if (isPlainObject(base) && isPlainObject(stored)) {
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(stored)) {
      out[k] = mergeDefaults(base[k], v);
    }
    return out;
  }
  return stored;
};

const repo = () => AppDataSource.getRepository(Setting);

export const SettingsService = {
  async get<K extends SettingsKey>(key: K): Promise<(typeof defaultSettings)[K]> {
    const row = await repo().findOneBy({ key });
    return mergeDefaults(defaultSettings[key], row?.value) as (typeof defaultSettings)[K];
  },

  async getAll() {
    const rows = await repo().find();
    const byKey = new Map(rows.map((r) => [r.key, r.value]));
    return Object.fromEntries(
      settingsKeys.map((k) => [k, mergeDefaults(defaultSettings[k], byKey.get(k))])
    ) as typeof defaultSettings;
  },

  async set(key: SettingsKey, value: Record<string, unknown>) {
    await repo().save({ key, value });
    return this.get(key);
  },
};

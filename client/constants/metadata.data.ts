import { Metadata } from 'next';
import favicon from '@/public/assets/logo.png';
import { routes } from '@/lib/routes';
import { baseUrl } from '@/constants/site.data';
import { siteInfo } from '@/constants/site.data';

export const metadataMap: Record<string, Metadata> = {
  [routes.home()]: {
    title: `${siteInfo.name}`,
    description:
      'TodoTipo. provides high-quality, eco-friendly wood-plastic composite (WPC) solutions for builders, architects, and homeowners. Explore premium decking, cladding, and more — engineered for durability and sustainability.',
    icons: favicon.src,
    keywords: [
      'WPC Canada',
      'wood plastic composite',
      'eco-friendly decking',
      'WPC cladding',
      'building materials Canada',
      'sustainable construction',
      'Todotipo Canada',
      'WPC suppliers Canada',
      'modern building materials',
      'durable outdoor materials',
    ],
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
  },

  [routes.aboutUs()]: {
    title: 'About Us | TodoTipo.',
    description:
      'TodoTipo. is a Canadian leader in eco-friendly wood-plastic composite (WPC) building materials. Our mission is to empower builders, architects, and homeowners with sustainable, durable, and innovative solutions for modern construction.',
    keywords: [
      'about Todotipo Canada',
      'WPC company Canada',
      'sustainable building materials',
      'eco-friendly construction',
      'wood plastic composite suppliers',
      'Canadian building material company',
    ],
  },

  [routes.contactUs()]: {
    title: 'Contact TodoTipo. | Speak with WPC Experts',
    description:
      'Have questions about our WPC products or services? Get in touch with the Todotipo Canada team for tailored advice and material solutions.',
    keywords: [
      'contact Todotipo',
      'WPC inquiries Canada',
      'building material suppliers contact',
      'eco-materials support',
    ],
  },

  [routes.products()]: {
    title: 'Our Products | WPC Decking, Cladding & More in Canada',
    description:
      'Discover Todotipo Canada’s full range of wood-plastic composite products. From durable decking to sleek cladding, our WPC materials are designed for strength, sustainability, and style.',
    keywords: [
      'WPC decking Canada',
      'WPC cladding suppliers',
      'WPC materials',
      'durable outdoor materials',
      'sustainable building supplies',
      'eco construction Canada',
      'Todotipo product listings',
    ],
  },

  [routes.terms()]: {
    title: 'Terms & Conditions | TodoTipo.',
    description:
      'Review the terms and conditions for using TodoTipo.’s website and purchasing our WPC building materials and solutions.',
    keywords: [
      'Todotipo terms of service',
      'building materials terms',
      'WPC site terms Canada',
    ],
  },

  [routes.privacy()]: {
    title: 'Privacy Policy | TodoTipo.',
    description:
      'Learn how TodoTipo. collects, uses, and protects your personal data when interacting with our WPC services and website.',
    keywords: [
      'Todotipo privacy policy',
      'data protection Canada',
      'WPC website privacy',
    ],
  },
};

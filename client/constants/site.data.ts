import { routes } from '@/lib/routes';
import { config } from './config';

// images
import hero from '@/public/assets/heroImage.svg';
import img1 from '@/public/assets/leaf.svg';
import img2 from '@/public/assets/weather.svg';
import img3 from '@/public/assets/check.svg';
import img4 from '@/public/assets/custom.svg';
import img5 from '@/public/assets/dollar.svg';
import img6 from '@/public/assets/lightning.svg';
import workspace from '@/public/assets/workspace.svg';
import backyard from '@/public/assets/backyard.svg';

export const baseUrl = `${config.BASE_URL}`;

export const CHATBOT = 'DDDDDDDD';

export const siteInfo = {
  siteLink: baseUrl,
  name: 'Todotipo Canada Inc.',
  phone: '+(307) 565-0033',
  email: 'support@todotipo.ca',
  address: '',
  jurisdiction: 'Houston, Texas',
};

export const home = {
  hero: {
    heroImage: hero.src,
    tag: ['Modern', '•', 'Minimalistic', 'Sustainable'],
    title: 'Premium Building Textiles for Modern Architecture',
    desc: 'Discover our range of high quality WPC materials that combines aesthetics, durability and sustainability for your next project',
    cta: {
      1: {
        text: 'Request Quote',
        link: routes.contactUs(),
      },
      2: {
        text: 'Explore Products',
        link: routes.products(),
      },
    },
  },
  quote:
    'At Todotipo Canada Inc., we empower builders, architects, and homeowners with premium building materials and eco-friendly wood-plastic composite (WPC) solutions. From durable decking to stylish cladding, our products blend strength, sustainability, and innovation to bring your projects to life. Based in Canada, we’re committed to quality, reliability, and exceptional service, helping you create spaces that last.',
  whyUs: {
    title: 'Why Choose Us',
    desc: 'Discover the advantage that makes us and our products stand out in the industry',
    list: [
      {
        image: img1.src,
        name: 'Eco-Friendly',
        desc: 'Our materials are made from recycled wood fibres and polymers reducing environmental impacts while maintaining superior quality ',
      },
      {
        image: img2.src,
        name: 'Weather Resistant',
        desc: 'Made to withstand extreme weather conditions, our materials maintain their appearance and structural integrity year after year.',
      },
      {
        image: img3.src,
        name: 'Low Maintenance',
        desc: 'Unlike traditional wood, our materials require minimal upkeep, saving you time and money on maintenance costs. ',
      },
      {
        image: img4.src,
        name: 'Customizable',
        desc: 'Available in a wide range of colors, textures, and finishes to match your design vision and architectural requirements.',
      },
      {
        image: img5.src,
        name: 'Cost Effective',
        desc: 'Higher initial investment compared to traditional materials, but significantly lower lifetime costs due to durability and minimal maintenance.',
      },
      {
        image: img6.src,
        name: 'Easy Installation',
        desc: 'Our innovative design allows for quick and straightforward installation, reducing labor costs and project timelines.',
      },
    ],
  },
  designCases: {
    title: 'Design Cases',
    desc: 'Let’s take a look at how our products can transform spaces with durability and eco-friendly designs',
    link: routes.designCase(),
    list: [
      {
        tags: ['residential', 'doors', 'wall panels', 'complex'],
        image: backyard.src,
        name: 'Backyard Oasis',
        desc: 'A stunning outdoor living space transformed by installing composite decking and WPC fence. Now, a beautiful, low maintenance area for relaxation and entertainment with added privacy.',
        id: 'ddddddd',
      },
      {
        tags: ['Commercial', 'Flooring', 'Ceilings', 'Durability'],
        image: workspace.src,
        name: 'Modernized Workspace',
        desc: 'Enhancing and modernizing a workspace by installing flooring and composite ceiling panels giving the office a sleek, contemporary look. The durable flooring withstands daily wears and.....',
        id: 'ssssss',
      },
    ],
  },
};

export const about = {
  title: '',
  desc: '',
  image: '',
};

export const companyPages = [
  {
    name: 'Home',
    link: routes.home(),
  },
  {
    name: 'About us',
    link: routes.aboutUs(),
  },
  {
    name: 'Products',
    link: routes.products(),
  },
  {
    name: 'Design case',
    link: routes.designCase(),
  },
  {
    name: 'Contact us',
    link: routes.contactUs(),
  },
];

export const productPages = [
  {
    name: 'Decking',
    link: routes.decking(),
  },
  {
    name: 'Composite flooring',
    link: routes.compositeFlooring(),
  },
  {
    name: 'Composite ceilings',
    link: routes.compositeCeilings(),
  },
  {
    name: 'Wall panels',
    link: routes.wallPanels(),
  },
  {
    name: 'Composite fencing',
    link: routes.compositeFencing(),
  },
];

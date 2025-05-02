import { routes } from '@/lib/routes';
import { config } from './config';

// home images
import hero from '@/public/assets/heroImage.svg';
import img1 from '@/public/assets/leaf.svg';
import img2 from '@/public/assets/weather.svg';
import img3 from '@/public/assets/check.svg';
import img4 from '@/public/assets/custom.svg';
import img5 from '@/public/assets/dollar.svg';
import img6 from '@/public/assets/lightning.svg';
import workspace from '@/public/assets/workspace.svg';
import backyard from '@/public/assets/backyard.svg';
import greenhaven from '@/public/assets/green-haven.svg';
import boutiques from '@/public/assets/busy-boutiques.svg';
import prestigious from '@/public/assets/prestigious-residence.svg';
import mountain from '@/public/assets/mountain.svg';

export const baseUrl = `${config.BASE_URL}`;

export const CHATBOT = 'DDDDDDDD';

export const siteInfo = {
  siteLink: baseUrl,
  name: 'Todotipo Canada Inc',
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
      {
        tags: ['Public Space', 'Gates', 'Simple', 'Sustainability'],
        image: greenhaven.src,
        name: 'Green Haven',
        desc: 'An eco-friendly WPC benches and composite gate providing a sustainable and durable solution for this space. The benches blend seamlessly with the natural surroundings, and the gate...',
        id: 'ssssssdwccvess',
      },
      {
        tags: ['Residential', 'Doors', 'Wall Panels', 'Complex'],
        image: prestigious.src,
        name: 'Prestigious Residence',
        desc: 'Residential project showcasing the versatility of composite doors and wall panel designs, adding elegance and sophistication to the property. The unique patterns and finishes highlight innova...',
        id: 'sssss21@s',
      },
      {
        tags: ['Commercial', 'Flooring', 'Gate', 'Aesthetic'],
        image: boutiques.src,
        name: 'Busy Boutiques',
        desc: 'An eco friendly shopping store utilizing durable WPC flooring that withstands heavy foot traffic in this bustling retail environment while maintaining its aesthetic appeal. Composite gat..',
        id: 'sss125^sss',
      },
      {
        tags: ['Residential', 'Decking', 'Fencing', 'Cozy'],
        image: mountain.src,
        name: 'Mountain Retreat Cabin',
        desc: 'A crafted Banff cabin into a cozy, eco-conscious escape. The focus was blending rustic charm with modern durability, creating a serene haven for nature lovers.',
        id: 'ss1$#@ssss',
      },
    ],
  },
};

//
import aboutImg from '@/public/assets/about-image.svg';
import personWorkingWood from '@/public/assets/person-working-wood.svg';
import bigLogo from '@/public/assets/todotipo-about-logo.svg';
import quality from '@/public/assets/quality.svg';
import lightBulb from '@/public/assets/light-bulb.svg';
import heart from '@/public/assets/heart.svg';
import integrity from '@/public/assets/integrity.svg';
import community from '@/public/assets/community.svg';
import shake from '@/public/assets/shake.svg';

export const about = {
  tag: 'About Us',
  title: 'Crafting Sustainable Spaces ',
  desc: 'At Todotipo, we blend eco-friendly innovation with premium building materials to empower your vision, delivering durability and style for every project.',
  image: aboutImg.src,
  bigLogo: bigLogo.src,
  commit: {
    title: 'Our Commitment to Sustainability',
    desc: 'Building green, Shaping spaces that endure',
    image: personWorkingWood.src,
    details: {
      name: 'Building A Greener Future',
      desc: `At Todotipo, sustainability isn't just a buzzword—it's our foundation. We're committed to developing building materials that not only perform exceptionally but also minimize environmental impact throughout their lifecycle. From sourcing recycled materials to implementing energy-efficient manufacturing processes, we're constantly innovating to reduce our carbon footprint and help our clients achieve their sustainability goals.`,
      list: [
        {
          image: shake.src,
          name: 'Recycled Materials',
          desc: 'Up to 95% recycled content in our WPC products',
        },
        {
          image: shake.src,
          name: 'Water Conservation',
          desc: 'Closed-loop water systems in our manufacturing facilities',
        },
        {
          image: shake.src,
          name: 'Renewable Energy',
          desc: '80% of our production powered by renewable sources',
        },
        {
          image: shake.src,
          name: 'Carbon Reduction',
          desc: '30% lower carbon footprint than traditional materials',
        },
      ],
    },
  },
  details: {
    mission: {
      title: 'Our Mission',
      desc: 'To empower builders and dreamers with sustainable, high-quality materials that transform spaces responsibly. We provide eco-friendly WPC and building solutions, ensuring durability, style, and environmental care for every project across Canada',
    },
    vision: {
      title: 'Our Vision',
      desc: 'To lead the way in sustainable construction, creating a greener future through innovative materials. We aim to redefine building standards, making eco-conscious design accessible and inspiring for contractors, architects, and homeowners.',
    },
    story: {
      title: 'Our Story',
      desc: 'Todotipo Canada Inc. began with a simple idea: to build better, greener spaces. Founded in Canada, our passion for sustainability drove us to pioneer wood-plastic composite (WPC) solutions that blend durability with eco-conscious design. From our first project crafting a backyard deck to supplying architects with innovative cladding, we’ve grown into a trusted partner for contractors, architects, and homeowners. Every product—whether decking, flooring, fences, gates, ceilings, or doors—reflects our commitment to quality and the planet. We source responsibly, innovate relentlessly, and listen to our clients’ dreams. Today, Todotipo stands for spaces that last, inspire, and tread lightly on the earth, rooted in our mission to shape a sustainable future, one project at a time.',
    },
    coreValues: {
      title: '',
      list: [
        {
          image: img1.src,
          name: 'Sustainability',
          desc: 'Our materials are made from recycled wood fibres and polymers reducing environmental impacts while maintaining superior quality ',
        },
        {
          image: quality.src,
          name: 'Quality',
          desc: 'We craft durable, stylish products that meet the highest standards, ensuring trust and satisfaction.',
        },
        {
          image: lightBulb.src,
          name: 'Innovation',
          desc: 'We embrace cutting-edge technology to create versatile, forward-thinking building materials.',
        },
        {
          image: integrity.src,
          name: 'Integrity',
          desc: 'We operate with honesty and reliability, building strong relationships with our clients and partners.',
        },
        {
          image: community.src,
          name: 'Community',
          desc: 'We support the communities we serve, fostering spaces that bring people together.',
        },
        {
          image: heart.src,
          name: 'Customer Focus',
          desc: 'We listen to our clients’ needs, delivering tailored solutions that bring their visions to life.',
        },
      ],
    },
  },
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

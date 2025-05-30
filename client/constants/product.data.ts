export const productCategory = [
  { name: 'All', value: 'all' },
  { name: 'Decking', value: 'decking' },
  { name: 'Flutted Wall Panel', value: 'flutted-wall-panel' },
  { name: 'Wall Panels', value: 'wall-panels' },
  { name: 'Composite doors', value: 'composite-doors' },
  { name: 'Fencing', value: 'fencing' },
  { name: 'Gates', value: 'gates' },
] as const;

export type ProductCategoryValue = (typeof productCategory)[number]['value'];

interface objectValue {
  name: string;
  value: string;
}

interface imageObject {
  name: string;
  image: string;
}

interface gridPlate {
  image: string;
  name: string;
  lengthAndWidth: string;
  lengthImage: string;
  thickness: string;
  environmentalProtectionGrade: string;
  fireRating: string;
}

export interface Products {
  id: number | string;
  image: string;
  title: string;
  category: ProductCategoryValue;
  heroImage: string;
  otherImages?: string[];
  code?: string;
  model?: string;
  brand?: string;
  desc?: string[];
  descImages?: string[];
  specification?: objectValue[];
  optionalColors?: imageObject[];
  surfaceTreatment?: imageObject[];
  addOns?: imageObject[];
  hollowGridPlate?: gridPlate[];
  solidGridPlate?: gridPlate[];
  color?: object[];
  productPerformance?: imageObject[];
  caseAppreciation?: string[];
}

export const products: Products[] = [
  // Decking
  {
    id: 1,
    image: '/assets/solid-decking-board.svg',
    title: 'Solid Decking Board',
    category: 'decking',
    heroImage: '',
    otherImages: ['/assets/', '/assets/'],
    code: 'SP-OR',
    model: 'SP-OR05L',
    brand: 'Todotipo',
    desc: [
      'Introducing no-gap solid composite decking that seamlessly fits together with invisible joints. This premium gap-free decking features a patented tongue-and-groove design that locks planks tightly, eliminating the unsightly and hazardous spaces found in traditional deck builds.',
      'With solid construction, you get added strength, durability, and a firmer underfoot feel—ideal for high-traffic areas or elevated installations. Enjoy carefree outdoor living with no worries about twisted ankles from high heel gaps or valuables slipping through cracks. The solid board design also prevents debris build-up and makes cleaning a breeze, thanks to its smooth, crevice-free surface.',
      'From a distance, this no-gap solid decking mimics the elegance of interior hardwood flooring, showcasing rich colours and natural grain textures. The hidden fastener system and seamless joints create a sleek, modern appearance that enhances any outdoor setting.',
      'Without visible gaps, there’s no exposure of substructure elements like joists or clips—just a clean, polished surface from every angle. Your deck becomes a true extension of your home, blending beauty with structural integrity.',
      'Whether you prioritize superior strength or refined aesthetics, this patented no-gap solid composite decking offers a flawless solution. Bring lasting performance and seamless design to your outdoor space. Contact us today to upgrade your decking experience.',
    ],
    descImages: ['/assets/', '/assets/', '/assets/'],
    specification: [
      {
        name: 'Name',
        value: 'No Gap Solid Decking Board',
      },
      {
        name: 'Item',
        value: 'SPOR05L',
      },
      {
        name: 'Standard Size',
        value: '145X22mm',
      },
      {
        name: 'Delivery Time',
        value: 'Within 21 days',
      },
      {
        name: 'HS code',
        value: '39189090',
      },
      {
        name: 'Warranty',
        value: '10 years',
      },
    ],
    optionalColors: [
      {
        name: 'Antique',
        image: '/assets',
      },
      {
        name: 'Ashwood',
        image: '/assets',
      },
      {
        name: 'Dark Grey',
        image: '/assets',
      },
      {
        name: 'IPE',
        image: '/assets',
      },
      {
        name: 'Teak',
        image: '/assets',
      },
      {
        name: 'Walnut',
        image: '/assets',
      },
    ],
    surfaceTreatment: [
      {
        name: 'Front',
        image: '/assets',
      },
      {
        name: 'Back',
        image: '/assets',
      },
    ],
  },
  {
    id: 2,
    image: '/assets/hollow-decking-board.svg',
    title: 'Hollow Decking Board',
    category: 'decking',
    heroImage: '',
    otherImages: ['/assets/', '/assets/'],
    code: 'SP-OR',
    model: 'SP-OR05L',
    brand: 'Todotipo',
    desc: [
      'Introducing no-gap solid composite decking that seamlessly fits together with invisible joints. This premium gap-free decking features a patented tongue-and-groove design that locks planks tightly, eliminating the unsightly and hazardous spaces found in traditional deck builds.',
      'With solid construction, you get added strength, durability, and a firmer underfoot feel—ideal for high-traffic areas or elevated installations. Enjoy carefree outdoor living with no worries about twisted ankles from high heel gaps or valuables slipping through cracks. The solid board design also prevents debris build-up and makes cleaning a breeze, thanks to its smooth, crevice-free surface.',
      'From a distance, this no-gap solid decking mimics the elegance of interior hardwood flooring, showcasing rich colours and natural grain textures. The hidden fastener system and seamless joints create a sleek, modern appearance that enhances any outdoor setting.',
      'Without visible gaps, there’s no exposure of substructure elements like joists or clips—just a clean, polished surface from every angle. Your deck becomes a true extension of your home, blending beauty with structural integrity.',
      'Whether you prioritize superior strength or refined aesthetics, this patented no-gap solid composite decking offers a flawless solution. Bring lasting performance and seamless design to your outdoor space. Contact us today to upgrade your decking experience.',
    ],
    descImages: ['/assets/', '/assets/', '/assets/'],
    specification: [
      {
        name: 'Name',
        value: 'No Gap Solid Decking Board',
      },
      {
        name: 'Item',
        value: 'SPOR05L',
      },
      {
        name: 'Standard Size',
        value: '145X22mm',
      },
      {
        name: 'Delivery Time',
        value: 'Within 21 days',
      },
      {
        name: 'HS code',
        value: '39189090',
      },
      {
        name: 'Warranty',
        value: '10 years',
      },
    ],
    optionalColors: [
      {
        name: 'Antique',
        image: '/assets',
      },
      {
        name: 'Ashwood',
        image: '/assets',
      },
      {
        name: 'Dark Grey',
        image: '/assets',
      },
      {
        name: 'IPE',
        image: '/assets',
      },
      {
        name: 'Teak',
        image: '/assets',
      },
      {
        name: 'Walnut',
        image: '/assets',
      },
    ],
    surfaceTreatment: [
      {
        name: 'Front',
        image: '/assets',
      },
      {
        name: 'Back',
        image: '/assets',
      },
    ],
  },
  {
    id: 3,
    image: '/assets/composite-decking-board.svg',
    title: 'Composite Decking Board',
    category: 'decking',
    heroImage: '',
    otherImages: ['/assets/', '/assets/'],
    code: 'SP-OR',
    model: 'SP-OR05L',
    brand: 'Todotipo',
    desc: [
      'Introducing no-gap solid composite decking that seamlessly fits together with invisible joints. This premium gap-free decking features a patented tongue-and-groove design that locks planks tightly, eliminating the unsightly and hazardous spaces found in traditional deck builds.',
      'With solid construction, you get added strength, durability, and a firmer underfoot feel—ideal for high-traffic areas or elevated installations. Enjoy carefree outdoor living with no worries about twisted ankles from high heel gaps or valuables slipping through cracks. The solid board design also prevents debris build-up and makes cleaning a breeze, thanks to its smooth, crevice-free surface.',
      'From a distance, this no-gap solid decking mimics the elegance of interior hardwood flooring, showcasing rich colours and natural grain textures. The hidden fastener system and seamless joints create a sleek, modern appearance that enhances any outdoor setting.',
      'Without visible gaps, there’s no exposure of substructure elements like joists or clips—just a clean, polished surface from every angle. Your deck becomes a true extension of your home, blending beauty with structural integrity.',
      'Whether you prioritize superior strength or refined aesthetics, this patented no-gap solid composite decking offers a flawless solution. Bring lasting performance and seamless design to your outdoor space. Contact us today to upgrade your decking experience.',
    ],
    descImages: ['/assets/', '/assets/', '/assets/'],
    specification: [
      {
        name: 'Name',
        value: 'No Gap Solid Decking Board',
      },
      {
        name: 'Item',
        value: 'SPOR05L',
      },
      {
        name: 'Standard Size',
        value: '145X22mm',
      },
      {
        name: 'Delivery Time',
        value: 'Within 21 days',
      },
      {
        name: 'HS code',
        value: '39189090',
      },
      {
        name: 'Warranty',
        value: '10 years',
      },
    ],
    optionalColors: [
      {
        name: 'Antique',
        image: '/assets',
      },
      {
        name: 'Ashwood',
        image: '/assets',
      },
      {
        name: 'Dark Grey',
        image: '/assets',
      },
      {
        name: 'IPE',
        image: '/assets',
      },
      {
        name: 'Teak',
        image: '/assets',
      },
      {
        name: 'Walnut',
        image: '/assets',
      },
    ],
    surfaceTreatment: [
      {
        name: 'Front',
        image: '/assets',
      },
      {
        name: 'Back',
        image: '/assets',
      },
    ],
  },
  // flutted wall panels
  {
    id: 4,
    image: '/assets/flutted-wall-panel.svg',
    title: 'Flutted wall panel information',
    category: 'flutted-wall-panel',
    heroImage: '',
    otherImages: ['', ''],
    desc: [
      'The nano bamboo and wood fiber grid is a next-generation upgrade to traditional wooden grid systems, designed to meet the evolving demands of modern construction and interior design. By combining natural bamboo with advanced wood fiber technology at the nano level, this innovative material delivers exceptional performance while minimizing environmental impact.',
      'Traditional wooden grids, though widely used, are prone to several issues over time—especially in humid or variable climates. Wood tends to absorb moisture, leading to swelling, warping, mold growth, and even structural failure. These problems not only compromise the aesthetics and safety of a space but also result in high maintenance costs and the need for frequent replacement. Additionally, traditional wood processing contributes to deforestation and environmental degradation, making it a less sustainable option in today’s eco-conscious world.',
      'In contrast, the nano bamboo and wood fiber grid provides a highly stable and sustainable solution. Its moisture-proof, waterproof, mildew-resistant, and moth-proof properties make it ideal for long-term use, even in challenging environments such as bathrooms, kitchens, outdoor ceilings, and humid regions. The material does not deform or warp over time, ensuring a consistently clean and refined appearance.',
      'Beyond its functional benefits, this grid system is available in a variety of colors and finishes, allowing designers and homeowners to achieve both modern and classic aesthetics with ease. Its lightweight structure simplifies the installation process, reducing labor time and associated costs. Once installed, it forms a firm, durable, and visually appealing surface that enhances the overall quality of the space.',
      'The grid’s eco-friendly composition—made from renewable bamboo and recycled wood fibers—reflects a commitment to sustainability and resource conservation. It has quickly gained recognition and trust in both domestic and international markets, where customers appreciate its combination of durability, style, and environmental responsibility.',
      'In summary, the nano bamboo and wood fiber grid represents a smart, forward-thinking alternative to traditional wood. It delivers long-term value through its resilience, low maintenance, attractive appearance, and eco-conscious design—making it a preferred choice for architects, builders, and homeowners alike.',
    ],
    descImages: ['', ''],
    addOns: [
      {
        name: 'Water Proof',
        image: '/assets',
      },
      {
        name: 'Inspect prevention',
        image: '/assets',
      },
      {
        name: 'Environs Protection',
        image: '',
      },
      {
        name: 'flame retardant',
        image: '',
      },
    ],
    hollowGridPlate: [
      {
        image: '',
        name: '170 Hollow fluted wall panel',
        lengthAndWidth: '170*3000 (mm)',
        lengthImage: '',
        thickness: '23.5mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '170 arc fluted wall panel',
        lengthAndWidth: '100*3000 (mm)',
        lengthImage: '',
        thickness: '19.5mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '157 inner arc grille',
        lengthAndWidth: '157*3000 (mm)',
        lengthImage: '',
        thickness: '18.5mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '150 Arc fluted wall panel',
        lengthAndWidth: '150*3000 (mm)',
        lengthImage: '',
        thickness: '15mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '160 triangular grille',
        lengthAndWidth: '160*3000 (mm)',
        lengthImage: '',
        thickness: '15mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '170 Hollow fluted wall ',
        lengthAndWidth: '115*3000 (mm)',
        lengthImage: '',
        thickness: '13mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
    ],
    solidGridPlate: [
      {
        image: '',
        name: '153*24 solid fluted wall panel',
        lengthAndWidth: '153*3000 (mm)',
        lengthImage: '',
        thickness: '24mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '153*24 solid fluted wall panel',
        lengthAndWidth: '153*3000 (mm)',
        lengthImage: '',
        thickness: '24mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '153*24 solid fluted wall panel',
        lengthAndWidth: '153*3000 (mm)',
        lengthImage: '',
        thickness: '24mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '153*24 solid fluted wall panel',
        lengthAndWidth: '153*3000 (mm)',
        lengthImage: '',
        thickness: '24mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
      {
        image: '',
        name: '153*24 solid fluted wall panel',
        lengthAndWidth: '153*3000 (mm)',
        lengthImage: '',
        thickness: '24mm',
        environmentalProtectionGrade: 'E0',
        fireRating: 'B1',
      },
    ],
    color: [
      {
        name: 'Metal Series',
        images: [''],
      },
      {
        name: 'Wood Grain Series',
        images: [''],
      },
      {
        name: 'Solid Color Series',
        images: [''],
      },
      {
        name: 'Stone Series',
        images: [''],
      },
    ],
  },
  {
    id: 5,
    image: '/assets/bamboo-corner-wall.svg',
    title: 'Bamboo charcoal wood grille',
    category: 'flutted-wall-panel',
    heroImage: '',
    addOns: [
      {
        name: 'Water Proof',
        image: '/assets',
      },
      {
        name: 'Inspect prevention',
        image: '/assets',
      },
      {
        name: 'Environs Protection',
        image: '',
      },
      {
        name: 'flame retardant',
        image: '',
      },
    ],
    descImages: [],
    productPerformance: [{ name: 'waterproof Test', image: '' }],
    caseAppreciation: [],
  },
  {
    id: 6,
    image: '/assets/bamboo-wood-grille.svg',
    title: 'Bamboo wood grille',
    category: 'flutted-wall-panel',
    heroImage: '',
    addOns: [
      {
        name: 'Water Proof',
        image: '/assets',
      },
      {
        name: 'Bendable',
        image: '/assets',
      },
      {
        name: 'Environs Protection',
        image: '',
      },
      {
        name: 'flame retardant',
        image: '',
      },
    ],
    descImages: [],
    productPerformance: [
      { name: 'waterproof Test', image: '' },
      { name: 'Bent Forward', image: '' },
      { name: 'Bent Backwards', image: '' },
    ],
    caseAppreciation: [],
  },
  // wall-panels
  {
    id: 7,
    image: '/assets/hd-printing-wall-panel.svg',
    title: 'HD Printing wall panel',
    category: 'wall-panels',
    heroImage: '',
  },
  {
    id: 8,
    image: '/assets/spc-hd-wood-grain.svg',
    title: 'SPC/HD Wood Grain',
    category: 'wall-panels',
    heroImage: '',
  },
  {
    id: 9,
    image: '/assets/metal-series-wall-panel.svg',
    title: 'Metal Series wall panel',
    category: 'wall-panels',
    heroImage: '',
  },
  {
    id: 10,
    image: '/assets/stone-series-wall-panel.svg',
    title: 'Stone Series Wall Panel',
    category: 'wall-panels',
    heroImage: '',
  },
  {
    id: 11,
    image: '/assets/wood-grain-series-wall-panel.svg',
    title: 'Wood Grain Series Wall Panel',
    category: 'wall-panels',
    heroImage: '',
  },
  // composite-doors
  {
    id: 12,
    image: '/assets/classic-collection.svg',
    title: 'Classic Collection',
    category: 'composite-doors',
    heroImage: '',
  },
  {
    id: 13,
    image: '/assets/urban-collection.svg',
    title: 'Urban Collection',
    category: 'composite-doors',
    heroImage: '',
  },
  {
    id: 15,
    image: '/assets/country-collection.svg',
    title: 'Country Collection',
    category: 'composite-doors',
    heroImage: '',
  },
  {
    id: 16,
    image: '/assets/composite-door-information.svg',
    title: 'Composite Door Information',
    category: 'composite-doors',
    heroImage: '',
  },
  // fencing
  {
    id: 17,
    image: '/assets/Woven-Wood-Fence-Panels.svg',
    title: 'Wooden Woove Fence Panels',
    category: 'fencing',
    heroImage: '',
  },
  {
    id: 18,
    image: '/assets/slate-wall-fence.svg',
    title: 'Slate Wall Fence',
    category: 'fencing',
    heroImage: '',
  },
  // gates
  // {
  //   id: 22,
  //   image: '/assets/premium1.svg',
  //   title: 'Black Gate',
  //   category: 'gates',
  //   heroImage: '',
  // },
] as const;

export const PremiumProducts = [
  {
    id: 2,
    image: '/assets/premium1.svg',
    title: 'WPC Solid Slicing Board',
    category: 'premium',
  },
  {
    id: 3,
    title: 'Fluted Wall Panels',
    image: '/assets/premium2.svg',
    category: 'premium',
  },
  {
    id: 4,
    title: 'SPC/HD Wood Grain',
    image: '/assets/premium3.svg',
    category: 'premium',
  },
  {
    id: 5,
    title: 'Decking board',
    image: '/assets/decking1.png',
    category: 'premium',
  },
  {
    id: 6,
    title: 'WPC Wall Panel',
    image: '/assets/decking2.png',
    category: 'premium',
  },
  {
    id: 7,
    title: 'SPC/HD Wood Grain',
    image: '/assets/decking3.png',
    category: 'premium',
  },
  {
    id: 8,
    title: 'Composite Fencing',
    image: '/assets/decking4.png',
    category: 'premium',
  },
] as const;

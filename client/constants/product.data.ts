export const productCategory = [
  { name: 'All', value: 'all' },
  { name: 'Decking', value: 'decking' },
  { name: 'Flutted Wall Panel', value: 'flutted-wall-panel' },
  { name: 'Wall Panels', value: 'wall-panels' },
  { name: 'Composite doors', value: 'composite-doors' },
  { name: 'Fencing', value: 'fencing' },
] as const;

export type ProductCategoryValue = (typeof productCategory)[number]['value'];

interface objectValue {
  name: string;
  value: string;
}

interface imageObject {
  name: string;
  image: string | string[];
}

interface caseObject {
  name: string;
  image: string | string[];
  specification?: objectValue[];
}

interface details {
  name: string;
  types: imageObject[];
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

interface collection {
  name: string;
  image: string;
  styles: imageObject;
  details: details[];
}

export interface Products {
  id: number | string;
  seoImage?: string;
  image: string;
  title: string;
  category: ProductCategoryValue;
  heroImage: string | string[];
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
  case?: caseObject[];
  designSketches?: string[];
  collection?: collection;
}

export const products: Products[] = [
  // Decking
  {
    id: 1,
    image: '/assets/solid-decking-board.svg',
    title: 'Solid Decking Board',
    category: 'decking',
    heroImage: [
      '/assets/solid1.svg',
      '/assets/solid2.svg',
      '/assets/solid3.svg',
      '/assets/solid4.svg',
      '/assets/solid5.svg',
    ],
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
    descImages: [
      '/assets/solid-other-image.svg',
      '/assets/solid-other-image2.svg',
      '/assets/solid-other-image3.svg',
    ],
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
        image: '/assets/solid-antique.svg',
      },
      {
        name: 'Ashwood',
        image: '/assets/solid-ashwood.svg',
      },
      {
        name: 'Dark Grey',
        image: '/assets/solid-dark-grey.svg',
      },
      {
        name: 'IPE',
        image: '/assets/solid-ipe.svg',
      },
      {
        name: 'Teak',
        image: '/assets/solid-teak.svg',
      },
      {
        name: 'Walnut',
        image: '/assets/solid-walnut.svg',
      },
    ],
    surfaceTreatment: [
      {
        name: 'Front',
        image: '/assets/solid-front.svg',
      },
      {
        name: 'Back',
        image: '/assets/solid-back.svg',
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
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    category: 'flutted-wall-panel',
    heroImage: '',
    desc: [
      'The nano bamboo and wood fiber grid is a next-generation upgrade to traditional wooden grid systems, designed to meet the evolving demands of modern construction and interior design. By combining natural bamboo with advanced wood fiber technology at the nano level, this innovative material delivers exceptional performance while minimizing environmental impact.',
      'Traditional wooden grids, though widely used, are prone to several issues over time—especially in humid or variable climates. Wood tends to absorb moisture, leading to swelling, warping, mold growth, and even structural failure. These problems not only compromise the aesthetics and safety of a space but also result in high maintenance costs and the need for frequent replacement. Additionally, traditional wood processing contributes to deforestation and environmental degradation, making it a less sustainable option in today’s eco-conscious world.',
      'In contrast, the nano bamboo and wood fiber grid provides a highly stable and sustainable solution. Its moisture-proof, waterproof, mildew-resistant, and moth-proof properties make it ideal for long-term use, even in challenging environments such as bathrooms, kitchens, outdoor ceilings, and humid regions. The material does not deform or warp over time, ensuring a consistently clean and refined appearance.',
      'Beyond its functional benefits, this grid system is available in a variety of colors and finishes, allowing designers and homeowners to achieve both modern and classic aesthetics with ease. Its lightweight structure simplifies the installation process, reducing labor time and associated costs. Once installed, it forms a firm, durable, and visually appealing surface that enhances the overall quality of the space.',
      'The grid’s eco-friendly composition—made from renewable bamboo and recycled wood fibers—reflects a commitment to sustainability and resource conservation. It has quickly gained recognition and trust in both domestic and international markets, where customers appreciate its combination of durability, style, and environmental responsibility.',
      'In summary, the nano bamboo and wood fiber grid represents a smart, forward-thinking alternative to traditional wood. It delivers long-term value through its resilience, low maintenance, attractive appearance, and eco-conscious design—making it a preferred choice for architects, builders, and homeowners alike.',
    ],
    descImages: ['', ''],
    otherImages: ['', ''],
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
  // {
  //   id: 5,
  //   image: '/assets/bamboo-corner-wall.svg',
  //   title: 'Bamboo charcoal wood grille',
  //   category: 'flutted-wall-panel',
  //   heroImage: '',
  //   addOns: [
  //     {
  //       name: 'Water Proof',
  //       image: '/assets',
  //     },
  //     {
  //       name: 'Inspect prevention',
  //       image: '/assets',
  //     },
  //     {
  //       name: 'Environs Protection',
  //       image: '',
  //     },
  //     {
  //       name: 'flame retardant',
  //       image: '',
  //     },
  //   ],
  //   descImages: [],
  //   productPerformance: [{ name: 'waterproof Test', image: '' }],
  //   caseAppreciation: [],
  // },
  // {
  //   id: 6,
  //   image: '/assets/bamboo-wood-grille.svg',
  //   title: 'Bamboo wood grille',
  //   category: 'flutted-wall-panel',
  //   heroImage: '',
  //   addOns: [
  //     {
  //       name: 'Water Proof',
  //       image: '/assets',
  //     },
  //     {
  //       name: 'Bendable',
  //       image: '/assets',
  //     },
  //     {
  //       name: 'Environs Protection',
  //       image: '',
  //     },
  //     {
  //       name: 'flame retardant',
  //       image: '',
  //     },
  //   ],
  //   descImages: [],
  //   productPerformance: [
  //     { name: 'waterproof Test', image: '' },
  //     { name: 'Bent Forward', image: '' },
  //     { name: 'Bent Backwards', image: '' },
  //   ],
  //   caseAppreciation: [],
  // },
  // wall-panels
  {
    id: 7,
    image: '/assets/hd-printing-wall-panel.svg',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    title: 'HD Printing wall panel',
    category: 'wall-panels',
    heroImage: '',
    addOns: [
      {
        image: '',
        name: 'Water Proof',
      },
      {
        image: '',
        name: 'Insect prevention',
      },
      {
        image: '',
        name: 'High Definition',
      },
      {
        image: '',
        name: 'Flame Retardant',
      },
    ],
    descImages: [],
  },
  {
    id: 8,
    image: '/assets/spc-hd-wood-grain.svg',
    title: 'SPC/HD Wood Grain',
    category: 'wall-panels',
    heroImage: '',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    descImages: [],
  },
  {
    id: 9,
    image: '/assets/metal-series-wall-panel.svg',
    title: 'Metal Series wall panel',
    category: 'wall-panels',
    heroImage: '',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    desc: [
      'WPC uses polythene, polypropylene, and polyvinyl chloride instead of commonly used resin adhesives to mix with more than 50% of waste plant fibres such as wood powder, rice husk and straw to form new wood materials.',
      'Then, it produces boards or profiles through plastic processes such as extrusion molding and injection molding.',
    ],
    case: [
      {
        image: '',
        name: 'Metal Series Case 1 (TDP704)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Metal Series)',
          },
          {
            name: 'Material',
            value: 'Nanofibre powder',
          },
          {
            name: 'Length & Width',
            value: '1120*2800(mm)',
          },
          {
            name: 'Thickness',
            value: '5mm&8mm',
          },
          {
            name: 'Environmental Protection Grade',
            value: 'ENF',
          },
          {
            name: 'Fire Rating',
            value: 'B1',
          },
          {
            name: 'Performance',
            value: 'Waterproof and Bendable',
          },
        ],
      },
      {
        image: '',
        name: 'Metal Series Case 2 (TDP751)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Metal Series)',
          },
          {
            name: 'Material',
            value: 'Nanofibre powder',
          },
          {
            name: 'Length & Width',
            value: '1120*2800(mm)',
          },
          {
            name: 'Thickness',
            value: '5mm&8mm',
          },
          {
            name: 'Environmental Protection Grade',
            value: 'ENF',
          },
          {
            name: 'Fire Rating',
            value: 'B1',
          },
          {
            name: 'Performance',
            value: 'Waterproof and Bendable',
          },
        ],
      },
      {
        image: [''],
        name: 'Metal Series Case 3 (TDP712)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Metal Series)',
          },
          {
            name: 'Material',
            value: 'Nanofibre powder',
          },
          {
            name: 'Length & Width',
            value: '1120*2800(mm)',
          },
          {
            name: 'Thickness',
            value: '5mm&8mm',
          },
          {
            name: 'Environmental Protection Grade',
            value: 'ENF',
          },
          {
            name: 'Fire Rating',
            value: 'B1',
          },
          {
            name: 'Performance',
            value: 'Waterproof and Bendable',
          },
        ],
      },
      {
        image: [''],
        name: 'Metal Series Case 4 (TDP701)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Metal Series)',
          },
          {
            name: 'Material',
            value: 'Nanofibre powder',
          },
          {
            name: 'Length & Width',
            value: '1120*2800(mm)',
          },
          {
            name: 'Thickness',
            value: '5mm&8mm',
          },
          {
            name: 'Environmental Protection Grade',
            value: 'ENF',
          },
          {
            name: 'Fire Rating',
            value: 'B1',
          },
          {
            name: 'Performance',
            value: 'Waterproof and Bendable',
          },
        ],
      },
    ],
  },
  {
    id: 10,
    image: '/assets/stone-series-wall-panel.svg',
    title: 'Stone Series Wall Panel',
    brand: 'Todotipo',
    model: 'SP-ORO5L',
    code: 'SP-OR',
    category: 'wall-panels',
    addOns: [
      {
        image: '',
        name: 'Water Proof',
      },
      {
        image: '',
        name: 'Insect prevention',
      },
      {
        image: '',
        name: 'High Definition',
      },
      {
        image: '',
        name: 'Flame Retardant',
      },
    ],
    heroImage: [''],
    desc: [
      'WPC uses polythene, polypropylene, and polyvinyl chloride instead of commonly used resin adhesives to mix with more than 50% of waste plant fibres such as wood powder, rice husk and straw to form new wood materials.',
      'Then, it produces boards or profiles through plastic processes such as extrusion molding and injection molding.',
    ],
    descImages: [],
    case: [],
    color: [
      {
        name: 'Colors',
        image: '',
      },
    ],
  },
  {
    id: 11,
    image: '/assets/wood-grain-series-wall-panel.svg',
    title: 'Wood Grain Series Wall Panel',
    category: 'wall-panels',
    heroImage: '',
    desc: [
      'WPC uses polythene, polypropylene, and polyvinyl chloride instead of commonly used resin adhesives to mix with more than 50% of waste plant fibres such as wood powder, rice husk and straw to form new wood materials.',
      'Then, it produces boards or profiles through plastic processes such as extrusion molding and injection molding.',
    ],
    descImages: [''],
    case: [
      {
        name: 'Wood Grain Series Case 1 (8005)',
        image: [''],
      },
      {
        name: 'Wood Grain Series Case 2 (8024)',
        image: [''],
      },
    ],
    color: [
      {
        name: '',
        colors: [''],
      },
    ],
  },
  // composite-doors
  {
    id: 12,
    image: '/assets/classic-collection.svg',
    title: 'Classic Collection',
    category: 'composite-doors',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    desc: [
      'Composite doors combine the best of multiple materials to deliver superior strength, durability, and aesthetic appeal. Designed to withstand the elements, they feature a solid timber core encased in a weather-resistant outer layer, offering excellent thermal efficiency, security, and low maintenance. Available in a wide range of styles and finishes, composite doors are the perfect upgrade for any home, blending classic looks with modern performance.',
    ],
    descImages: [''],
    heroImage: [''],
    collection: {
      name: 'Classic Collections',
      image: '',
      styles: {
        name: 'Popular Classic Styles',
        image: [''],
      },
      details: [
        {
          name: 'Classic Accessories',
          types: [
            {
              name: 'Heritage Pull Knob',
              image: '',
            },
            {
              name: 'Classic Escutcheon',
              image: '',
            },
            {
              name: 'Classic Urm Knocker',
              image: '',
            },
            {
              name: 'Classic Slimline Knocker',
              image: '',
            },
            {
              name: 'Classic Leather Plate',
              image: '',
            },
            {
              name: 'Classic Level Pad',
              image: '',
            },
          ],
        },
        {
          name: 'Classic Glazing Designs',
          types: [
            {
              name: 'Riviera',
              image: '',
            },
            {
              name: 'Regal',
              image: '',
            },
            {
              name: 'Sarah',
              image: '',
            },
            {
              name: 'Virtue',
              image: '',
            },
            {
              name: 'Spring',
              image: '',
            },
            {
              name: 'Opal',
              image: '',
            },
          ],
        },
      ],
    },
  },
  {
    id: '12-urban-collection',
    image: '/assets/urban-collection.svg',
    title: 'Urban Collection',
    category: 'composite-doors',
    heroImage: '',
    collection: {
      name: 'Urban Collections',
      image: '',
      styles: {
        name: 'Popular Urban Styles',
        image: [''],
      },
      details: [
        {
          name: 'Urban Accessories',
          types: [
            {
              name: 'Square Pull Handle',
              image: '',
            },
            {
              name: 'Lever Handle',
              image: '',
            },
            {
              name: 'Square Pull Knob',
              image: '',
            },
            {
              name: 'Round Pull Knob',
              image: '',
            },
            {
              name: 'Classic Escutcheon',
              image: '',
            },
            {
              name: 'Leather plate',
              image: '',
            },
          ],
        },
        {
          name: 'Urban Glazing Designs',
          types: [
            {
              name: 'Fabian',
              image: '',
            },
            {
              name: 'Harmony',
              image: '',
            },
            {
              name: 'Comete',
              image: '',
            },
            {
              name: 'Virtue',
              image: '',
            },
            {
              name: 'Clarence',
              image: '',
            },
            {
              name: 'Olympias',
              image: '',
            },
          ],
        },
      ],
    },
  },
  {
    id: '12-anvantal-collection',
    image: '/assets/country-collection.svg',
    title: 'Anvantal Collection',
    category: 'composite-doors',
    heroImage: '',
    collection: {
      name: 'Avantal Collections',
      image: '',
      styles: {
        name: 'Popular Avantal Styles',
        image: [''],
      },
      details: [
        {
          name: 'Avantal Accessories',
          types: [
            {
              name: 'Lever Handle',
              image: '',
            },
            {
              name: 'Knocker',
              image: '',
            },
            {
              name: 'Pull Bar',
              image: '',
            },
            {
              name: 'Round Pull Knob',
              image: '',
            },
            {
              name: 'Square Pull Knob',
              image: '',
            },
          ],
        },
      ],
    },
  },
  // fencing
  {
    id: 17,
    image: '/assets/Woven-Wood-Fence-Panels.svg',
    title: 'Wooden Woove Fence Panels',
    category: 'fencing',
    heroImage: '',
    addOns: [
      {
        image: '',
        name: 'Water Proof',
      },
      {
        image: '',
        name: 'Insect prevention',
      },
      {
        image: '',
        name: 'High Definition',
      },
      {
        image: '100% Eco Material',
        name: 'UV Resistant',
      },
    ],
    desc: [
      'Your home is your castle, as they say. But, when other people are staring at your home or commercial property – be it your neighbours, passers-by, or the like – it’s easy to feel uncomfortable. Luckily, a high-quality fence can help with this.',
      'With a top-quality woven fence, you help ensure your outdoor space looks and performs at its best. Moreover, you help prevent prying eyes from looking in. You could even dissuade thieves from attempting to take your belongings for their own.',
      'A top-quality fence is vital to keep your home or commercial property safe and comfortable. However, in many cases, it can seem like we have no option other than to compromise on either durability or aesthetics.',
      'But why should it have to be this way? Fortunately, with our stunning woven fence design, you won’t have to. Made from 100% eco-friendly and recyclable materials WPC, our stunning woven fence is UV resistant, insect resistant, and fully waterproof. Plus, each fence is available in various colours, and the unique woven design adds a little extra charm and magic to your property as a result. So, why not give it a try – you might at amazed by the value our woven fences could bring!',
      'Because the high praise of the co-extrusion woven fence gave us great confidence in co-extrusion WPC fence development, we opened a new mold for the privacy fence. After the marketing research, we will promote two colours for the WPC fence at the beginning, and we have displayed the latest products in our showroom.',
    ],
    color: [
      {
        name: 'Antique',
        color: '',
      },
      {
        name: 'Ashwood',
        color: '',
      },
      {
        name: 'Dark Grey',
        color: '',
      },
      {
        name: 'IPE',
        color: '',
      },
      {
        name: 'Teak',
        color: '',
      },
      {
        name: 'Walnut',
        color: '',
      },
    ],
    designSketches: [''],
  },
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

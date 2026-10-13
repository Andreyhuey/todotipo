export const productCategory = [
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

// interface gridPlate {
//   image: string;
//   name: string;
//   lengthAndWidth: string;
//   lengthImage: string;
//   thickness: string;
//   environmentalProtectionGrade: string;
//   fireRating: string;
// }

interface collection {
  name: string;
  image: string;
  styles: imageObject;
  details: details[];
}

export interface Products {
  id: number | string;
  seoImage: string;
  image: string;
  title: string;
  category: ProductCategoryValue;
  heroImage: string | string[];
  otherImages?: string[];
  code: string;
  model: string;
  brand: string;
  desc?: string[];
  video?: string;
  descImages?: string[];
  specification?: objectValue[];
  optionalColors?: imageObject[];
  surfaceTreatment?: imageObject[];
  addOns?: imageObject[];
  // hollowGridPlate?: gridPlate[];
  // solidGridPlate?: gridPlate[];
  plate?: imageObject[];
  color?: imageObject[];
  productPerformance?: imageObject[];
  caseAppreciation?: string[];
  case?: caseObject[];
  designSketches?: string[];
  collection?: collection[];
}

export const products: Products[] = [
  // Decking
  {
    id: 1,
    seoImage: '/assets/solid-decking-board.jpg',
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
    seoImage: '/assets/hollow-decking-board.jpg',
    image: '/assets/hollow-decking-board.svg',
    title: 'Hollow Decking Board',
    category: 'decking',

    heroImage: [
      '/assets/hollow20.svg',
      '/assets/hollow30.svg',
      '/assets/hollow40.svg',
      '/assets/hollow50.svg',
      '/assets/hollow60.svg',
    ],
    code: 'SP-OR',
    model: 'SP-OR05L',
    brand: 'Todotipo',
    desc: [
      'Introducing no-gap hollow decking that connects seamlessly with invisible joints for a flawless finish. This innovative decking solution features a patented tongue-and-groove system that locks each board tightly together, eliminating the gaps and uneven spacing common in traditional builds.',
      'Engineered with a lightweight hollow core, this decking offers excellent structural performance while reducing material weight making it easier to handle and install. Despite its lighter profile, it maintains impressive strength and stability, ideal for residential decks, patios, and balconies.',
      'Say goodbye to twisted ankles, dropped keys, and dirt-trapping cracks. The gap-free surface prevents debris build-up and allows for easy cleaning, with no crevices for grime or moisture to collect. The result is a low-maintenance, high-style outdoor living space.',
      'From afar, the decking resembles sleek interior flooring, with rich colors and wood-like textures that elevate your exterior design. The hidden fastener system and continuous board connections provide a streamlined, modern aesthetic with no visible interruptions or hardware.',
      'With no gaps to reveal the under-structure, your deck stays visually clean and cohesive from every angle. The hollow design adds efficiency without compromising beauty or function.',
      'Perfect for those who want contemporary style, reduced weight, and seamless performance, this patent no-gap hollow composite decking delivers a smart and stunning solution for your outdoor space. Reach out today to transform your deck with this lightweight innovation.',
    ],
    descImages: [
      '/assets/hollow1.svg',
      '/assets/hollow2.svg',
      '/assets/hollow3.svg',
    ],
    specification: [
      {
        name: 'Name',
        value: 'No Gap Hollow Decking Board',
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
    id: 3,
    seoImage: '/assets/composite-decking-board.jpg',
    image: '/assets/composite-decking-board.svg',
    title: 'Composite Decking Board',
    category: 'decking',
    heroImage: [
      '/assets/composite1.svg',
      '/assets/composite2.svg',
      '/assets/composite3.svg',
      '/assets/composite4.svg',
      '/assets/composite5.svg',
    ],
    descImages: [
      '/assets/composite6.svg',
      '/assets/composite7.svg',
      '/assets/composite8.svg',
    ],
    code: 'SP-OR',
    model: 'SP-OR05L',
    brand: 'Todotipo',
    desc: [
      'Introducing no-gap composite decking boards that join seamlessly for a smooth, flawless finish. Designed with a patented tongue-and-groove system, these boards connect tightly without the need for visible gaps, eliminating the spacing issues and safety hazards common in traditional decking.',
      'Crafted from a blend of wood fibers and recycled polymers, these composite boards offer the natural look of timber with the long-lasting durability of modern materials. Resistant to rot, splintering, and fading, they provide a low-maintenance solution built to withstand the elements for years to come.',
      'Enjoy your outdoor space without worry—no more heels caught in cracks, lost items slipping through gaps, or debris collecting between boards. The flush, uniform surface wipes clean easily and enhances both comfort and cleanliness.',
      'From a distance, these no-gap composite boards resemble high-end indoor flooring, featuring rich woodgrain textures and contemporary color options. The hidden fastener system and seamless joints give your deck a sleek, modern appearance without any visual interruptions.',
      'With the elimination of gaps, the understructure remains out of sight, creating a polished, uninterrupted surface from every angle. Your deck becomes a visually cohesive extension of your home, offering both beauty and practicality.',
      `Whether you're building for style, safety, or long-term performance, these patented no-gap composite decking boards deliver a superior outdoor living experience. Contact us today to upgrade your deck with this seamless, smart solution.`,
    ],
    specification: [
      {
        name: 'Name',
        value: 'No Gap Composite Decking Board',
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
  // flutted wall panels
  {
    id: 4,
    seoImage: '/assets/flutted-wall-panel.jpg',
    image: '/assets/flutted-wall-panel.svg',
    title: 'Flutted wall panel information',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    category: 'flutted-wall-panel',
    heroImage: [
      '/assets/flutted-wall-1.svg',
      '/assets/flutted-wall-2.svg',
      '/assets/flutted-wall-3.svg',
      '/assets/flutted-wall-4.svg',
      '/assets/flutted-wall-5.svg',
    ],
    desc: [
      'The nano bamboo and wood fiber grid is a next-generation upgrade to traditional wooden grid systems, designed to meet the evolving demands of modern construction and interior design. By combining natural bamboo with advanced wood fiber technology at the nano level, this innovative material delivers exceptional performance while minimizing environmental impact.',
      'Traditional wooden grids, though widely used, are prone to several issues over time—especially in humid or variable climates. Wood tends to absorb moisture, leading to swelling, warping, mold growth, and even structural failure. These problems not only compromise the aesthetics and safety of a space but also result in high maintenance costs and the need for frequent replacement. Additionally, traditional wood processing contributes to deforestation and environmental degradation, making it a less sustainable option in today’s eco-conscious world.',
      'In contrast, the nano bamboo and wood fiber grid provides a highly stable and sustainable solution. Its moisture-proof, waterproof, mildew-resistant, and moth-proof properties make it ideal for long-term use, even in challenging environments such as bathrooms, kitchens, outdoor ceilings, and humid regions. The material does not deform or warp over time, ensuring a consistently clean and refined appearance.',
      'Beyond its functional benefits, this grid system is available in a variety of colors and finishes, allowing designers and homeowners to achieve both modern and classic aesthetics with ease. Its lightweight structure simplifies the installation process, reducing labor time and associated costs. Once installed, it forms a firm, durable, and visually appealing surface that enhances the overall quality of the space.',
      'The grid’s eco-friendly composition—made from renewable bamboo and recycled wood fibers—reflects a commitment to sustainability and resource conservation. It has quickly gained recognition and trust in both domestic and international markets, where customers appreciate its combination of durability, style, and environmental responsibility.',
      'In summary, the nano bamboo and wood fiber grid represents a smart, forward-thinking alternative to traditional wood. It delivers long-term value through its resilience, low maintenance, attractive appearance, and eco-conscious design—making it a preferred choice for architects, builders, and homeowners alike.',
    ],
    video: '/assets/video-file.mp4',
    addOns: [
      {
        image: '/assets/water-proof.svg',
        name: 'Water Proof',
      },
      {
        image: '/assets/insect-prevention.svg',
        name: 'Insect prevention',
      },
      {
        image: '/assets/environs-protection.svg',
        name: 'Environs Protection',
      },
      {
        image: '/assets/flame-retardant.svg',
        name: 'Flame Retardant',
      },
    ],
    plate: [
      {
        name: 'Hollow Grid Plate',
        image: ['/assets/flutted-hollow-grid-plate.svg'],
      },
      {
        name: 'Solid Grid Plate',
        image: [
          '/assets/flutted-solid-grid-plate.svg',
          '/assets/flutted-other-images2.svg',
        ],
      },
    ],
    // hollowGridPlate: [
    //   {
    //     image: '',
    //     name: '170 Hollow fluted wall panel',
    //     lengthAndWidth: '170*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '23.5mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '170 arc fluted wall panel',
    //     lengthAndWidth: '100*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '19.5mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '157 inner arc grille',
    //     lengthAndWidth: '157*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '18.5mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '150 Arc fluted wall panel',
    //     lengthAndWidth: '150*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '15mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '160 triangular grille',
    //     lengthAndWidth: '160*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '15mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '170 Hollow fluted wall ',
    //     lengthAndWidth: '115*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '13mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    // ],
    // solidGridPlate: [
    //   {
    //     image: '',
    //     name: '153*24 solid fluted wall panel',
    //     lengthAndWidth: '153*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '24mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '153*24 solid fluted wall panel',
    //     lengthAndWidth: '153*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '24mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '153*24 solid fluted wall panel',
    //     lengthAndWidth: '153*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '24mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '153*24 solid fluted wall panel',
    //     lengthAndWidth: '153*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '24mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    //   {
    //     image: '',
    //     name: '153*24 solid fluted wall panel',
    //     lengthAndWidth: '153*3000 (mm)',
    //     lengthImage: '',
    //     thickness: '24mm',
    //     environmentalProtectionGrade: 'E0',
    //     fireRating: 'B1',
    //   },
    // ],
    color: [
      {
        name: 'Solid Color Series',
        image: [
          '/assets/solid-color-series1.svg',
          '/assets/solid-color-series2.svg',
          '/assets/solid-color-series3.svg',
          '/assets/solid-color-series4.svg',
        ],
      },
      {
        name: 'Metal Series',
        image: [
          '/assets/flutted-metal-series.svg',
          '/assets/flutted-metal-series2.svg',
        ],
      },
      {
        name: ' Wood Grain Series',
        image: [
          '/assets/flutted-solid-color-series-1.svg',
          '/assets/flutted-solid-color-series-2.svg',
          '/assets/flutted-solid-color-series-3.svg',
          '/assets/flutted-solid-color-series-colors.svg',
        ],
      },
      {
        name: 'Stone Series',
        image: [
          '/assets/flutted-stone-series.svg',
          '/assets/flutted-stone-series-colors.svg',
        ],
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
    seoImage: '/assets/hd-printing-wall-panel.jpg',
    image: '/assets/hd-printing-wall-panel.svg',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    title: 'HD Printing wall panel',
    category: 'wall-panels',
    heroImage: [
      '/assets/hd-printing-wall-panel1.svg',
      '/assets/hd-printing-wall-panel2.svg',
      '/assets/hd-printing-wall-panel3.svg',
      '/assets/hd-printing-wall-panel4.svg',
      '/assets/hd-printing-wall-panel5.svg',
    ],
    addOns: [
      {
        image: '/assets/water-proof.svg',
        name: 'Water Proof',
      },
      {
        image: '/assets/insect-prevention.svg',
        name: 'Insect prevention',
      },
      {
        image: '/assets/high-definition.svg',
        name: 'High Definition',
      },
      {
        image: '/assets/flame-retardant.svg',
        name: 'Flame Retardant',
      },
    ],
    descImages: [
      '/assets/hd-printing-wall-panel6.svg',
      '/assets/hd-printing-wall-panel7.svg',
      '/assets/hd-printing-wall-panel8.svg',
      '/assets/hd-printing-wall-panel9.svg',
      '/assets/hd-printing-wall-panel10.svg',
      '/assets/hd-printing-wall-panel11.svg',
      '/assets/hd-printing-wall-panel12.svg',
      '/assets/hd-printing-wall-panel13.svg',
    ],
  },
  // images here are not downloadable
  {
    id: 8,
    seoImage: '/assets/spc-hd-wood-grain.jpg',
    image: '/assets/spc-hd-wood-grain.svg',
    title: 'SPC/HD Wood Grain',
    category: 'wall-panels',
    heroImage: [
      '/assets/spc-printing-wall-panel1.svg',
      '/assets/hd-printing-wall-panel2.svg',
      '/assets/hd-printing-wall-panel3.svg',
      '/assets/hd-printing-wall-panel4.svg',
      '/assets/hd-printing-wall-panel5.svg',
    ],
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    descImages: [
      '/assets/spc1.svg',
      '/assets/spc2.svg',
      '/assets/spc3.svg',
      '/assets/spc4.svg',
      '/assets/spc5.svg',

      '/assets/spc7.svg',
      '/assets/spc7.svg',
      '/assets/spc8.svg',
      '/assets/spc9.svg',
      '/assets/spc10.svg',
      '/assets/spc11.svg',
      '/assets/spc12.svg',
      '/assets/spc13.svg',
      '/assets/spc14.svg',
    ],
  },
  {
    id: 9,
    seoImage: '/assets/metal-series-wall-panel.jpg',
    image: '/assets/metal-series-wall-panel.svg',
    title: 'Metal Series wall panel',
    category: 'wall-panels',
    heroImage: [
      '/assets/metal-series-1.svg',
      '/assets/metal-series-2.svg',
      '/assets/metal-series-3.svg',
      '/assets/metal-series-4.svg',
      '/assets/metal-series-5.svg',
    ],
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    desc: [
      'The Metal Series brings the look of brushed metal to interior walls without the weight, cost or cold touch of real metal. Each panel pairs a wood-plastic composite core with a metallic film finish, so it cuts and installs like any other Oaken wall panel.',
      'Use it for feature walls, reception desks, retail displays and ceilings. The surface is waterproof, flexible enough to follow gentle curves and wipes clean with a damp cloth.',
    ],
    descImages: ['/assets/metal-series-6.svg'],
    case: [
      {
        image: '/assets/metal-series-7.svg',
        name: 'Metal Series Case 1 (TDP704)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Metal Series)',
          },
          {
            name: 'Material',
            value: 'WPC core with metallic film finish',
          },
          {
            name: 'Length & Width',
            value: '1120 × 2800 mm',
          },
          {
            name: 'Thickness',
            value: '5 mm or 8 mm',
          },
          {
            name: 'Formaldehyde emission grade',
            value: 'ENF (lowest emission class)',
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
        image: '/assets/metal-series-8.svg',
        name: 'Metal Series Case 2 (TDP751)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Metal Series)',
          },
          {
            name: 'Material',
            value: 'WPC core with metallic film finish',
          },
          {
            name: 'Length & Width',
            value: '1120 × 2800 mm',
          },
          {
            name: 'Thickness',
            value: '5 mm or 8 mm',
          },
          {
            name: 'Formaldehyde emission grade',
            value: 'ENF (lowest emission class)',
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
        image: ['/assets/metal-series-9.svg', '/assets/metal-series-10.svg'],
        name: 'Metal Series Case 3 (TDP712)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Metal Series)',
          },
          {
            name: 'Material',
            value: 'WPC core with metallic film finish',
          },
          {
            name: 'Length & Width',
            value: '1120 × 2800 mm',
          },
          {
            name: 'Thickness',
            value: '5 mm or 8 mm',
          },
          {
            name: 'Formaldehyde emission grade',
            value: 'ENF (lowest emission class)',
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
        image: ['/assets/metal-series-11.svg', '/assets/metal-series-12.svg'],
        name: 'Metal Series Case 4 (TDP701)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Metal Series)',
          },
          {
            name: 'Material',
            value: 'WPC core with metallic film finish',
          },
          {
            name: 'Length & Width',
            value: '1120 × 2800 mm',
          },
          {
            name: 'Thickness',
            value: '5 mm or 8 mm',
          },
          {
            name: 'Formaldehyde emission grade',
            value: 'ENF (lowest emission class)',
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
    seoImage: '/assets/stone-series-wall-panel.jpg',
    image: '/assets/stone-series-wall-panel.svg',
    title: 'Stone Series Wall Panel',
    brand: 'Todotipo',
    model: 'SP-ORO5L',
    heroImage: [
      '/assets/stone-series1.svg',
      '/assets/stone-series2.svg',
      '/assets/stone-series3.svg',
      '/assets/stone-series4.svg',
      '/assets/stone-series5.svg',
    ],
    code: 'SP-OR',
    category: 'wall-panels',
    addOns: [
      {
        image: '/assets/water-proof.svg',
        name: 'Water Proof',
      },
      {
        image: '/assets/insect-prevention.svg',
        name: 'Insect prevention',
      },
      {
        image: '/assets/high-definition.svg',
        name: 'High Definition',
      },
      {
        image: '/assets/flame-retardant.svg',
        name: 'Flame Retardant',
      },
    ],
    desc: [
      'The Stone Series captures the depth and veining of natural marble and stone in a lightweight composite panel. A high-definition printed surface gives you the luxury of stone at a fraction of the weight, cost and installation time.',
      'Ideal for bathrooms, kitchens, lobbies and feature walls. The panels are waterproof, flame retardant and seamless enough to cover large walls without the grout lines of tile.',
    ],
    descImages: ['/assets/stone-series6.svg'],
    case: [
      {
        image: ['/assets/stone-series7.svg', '/assets/stone-series8.svg'],
        name: 'Stone Series Case 1 (51001)',
        specification: [
          {
            name: 'Name',
            value: 'WPC Wall Panel (Stone Series)',
          },
          {
            name: 'Material',
            value: 'WPC core with HD printed stone finish',
          },
          {
            name: 'Length & Width',
            value: '1120 × 2800 mm',
          },
          {
            name: 'Thickness',
            value: '5 mm or 8 mm',
          },
          {
            name: 'Formaldehyde emission grade',
            value: 'ENF (lowest emission class)',
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
    color: [
      {
        name: 'Colors',
        image: '/assets/stone-series9.svg',
      },
    ],
  },
  {
    id: 11,
    seoImage: '/assets/wood-grain-series-wall-panel.jpg',
    image: '/assets/wood-grain-series-wall-panel.svg',
    title: 'Wood Grain Series Wall Panel',
    category: 'wall-panels',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    heroImage: [
      '/assets/wood-grain1.svg',
      '/assets/wood-grain2.svg',
      '/assets/wood-grain3.svg',
      '/assets/wood-grain4.svg',
      '/assets/wood-grain5.svg',
    ],
    addOns: [
      {
        image: '/assets/water-proof.svg',
        name: 'Water Proof',
      },
      {
        image: '/assets/insect-prevention.svg',
        name: 'Insect prevention',
      },
      {
        image: '/assets/high-definition.svg',
        name: 'High Definition',
      },
      {
        image: '/assets/flame-retardant.svg',
        name: 'Flame Retardant',
      },
    ],
    desc: [
      'The Wood Grain Series gives interiors the warmth of real timber with none of the upkeep. Each panel carries a high-definition wood-grain finish on a composite core that will not warp, crack or attract insects.',
      'Choose from oak, walnut and teak tones for living rooms, bedrooms, offices and hotel corridors. Panels click together quickly and never need sanding, sealing or staining.',
    ],
    descImages: ['/assets/wood-grain6.svg'],
    case: [
      {
        name: 'Wood Grain Series Case 1 (8005)',
        image: [
          '/assets/wood-grain7.svg',
          '/assets/wood-grain8.svg',
          '/assets/wood-grain9.svg',
        ],
      },
      {
        name: 'Wood Grain Series Case 2 (8024)',
        image: [
          '/assets/wood-grain10.svg',
          '/assets/wood-grain11.svg',
          '/assets/wood-grain12.svg',
        ],
      },
    ],
    color: [
      {
        name: 'Colors',
        image: '/assets/wood-grain13.svg',
      },
    ],
  },
  // composite-doors
  {
    id: 12,
    seoImage: '/assets/classic-collection.jpg',
    image: '/assets/classic-collection.svg',
    title: 'Composite Doors',
    category: 'composite-doors',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    heroImage: [
      '/assets/door-collection.svg',
      '/assets/door-collection2.svg',
      '/assets/door-collection3.svg',
      '/assets/door-collection1.svg',
      '/assets/door-collection4.svg',
    ],
    desc: [
      'Composite doors combine the best of multiple materials to deliver superior strength, durability, and aesthetic appeal. Designed to withstand the elements, they feature a solid timber core encased in a weather-resistant outer layer, offering excellent thermal efficiency, security, and low maintenance. Available in a wide range of styles and finishes, composite doors are the perfect upgrade for any home, blending classic looks with modern performance.',
    ],
    descImages: ['/assets/door-collection5.svg'],
    collection: [
      {
        name: 'Classic Collections',
        image: '/assets/door-collection6.svg',
        styles: {
          name: 'Popular Classic Styles',
          image: [
            '/assets/door-collection7.svg',
            '/assets/door-collection8.svg',
            '/assets/door-collection9.svg',
            '/assets/door-collection10.svg',
            '/assets/door-collection11.svg',
            '/assets/door-collection12.svg',
          ],
        },
        details: [
          {
            name: 'Classic Accessories',
            types: [
              {
                name: 'Heritage Pull Knob',
                image: '/assets/door-collection13.svg',
              },
              {
                name: 'Classic Escutcheon',
                image: '/assets/door-collection14.svg',
              },
              {
                name: 'Classic Urm Knocker',
                image: '/assets/door-collection15.svg',
              },
              {
                name: 'Classic Slimline Knocker',
                image: '/assets/door-collection16.svg',
              },
              {
                name: 'Classic Leather Plate',
                image: '/assets/door-collection17.svg',
              },
              {
                name: 'Classic Level Pad',
                image: '/assets/door-collection18.svg',
              },
            ],
          },
          {
            name: 'Classic Glazing Designs',
            types: [
              {
                name: 'Riviera',
                image: '/assets/door-collection19.svg',
              },
              {
                name: 'Regal',
                image: '/assets/door-collection20.svg',
              },
              {
                name: 'Sarah',
                image: '/assets/door-collection21.svg',
              },
              {
                name: 'Virtue',
                image: '/assets/door-collection22.svg',
              },
              {
                name: 'Spring',
                image: '/assets/door-collection23.svg',
              },
              {
                name: 'Opal',
                image: '/assets/door-collection24.svg',
              },
            ],
          },
        ],
      },
      {
        name: 'Urban Collections',
        image: '/assets/urban-door-collection.svg',
        styles: {
          name: 'Popular Urban Styles',
          image: [
            '/assets/urban-door-collection1.svg',
            '/assets/urban-door-collection2.svg',
            '/assets/urban-door-collection3.svg',
            '/assets/urban-door-collection4.svg',
            '/assets/urban-door-collection5.svg',
            '/assets/urban-door-collection6.svg',
            '/assets/urban-door-collection7.svg',
            '/assets/urban-door-collection8.svg',
            '/assets/urban-door-collection9.svg',
          ],
        },
        details: [
          {
            name: 'Urban Accessories',
            types: [
              {
                name: 'Square Pull Handle',
                image: '/assets/urban-door-collection10.svg',
              },
              {
                name: 'Lever Handle',
                image: '/assets/urban-door-collection11.svg',
              },
              {
                name: 'Square Pull Knob',
                image: '/assets/urban-door-collection12.svg',
              },
              {
                name: 'Round Pull Knob',
                image: '/assets/urban-door-collection13.svg',
              },
              {
                name: 'Classic Escutcheon',
                image: '/assets/urban-door-collection14.svg',
              },
              {
                name: 'Leather plate',
                image: '/assets/urban-door-collection15.svg',
              },
            ],
          },
          {
            name: 'Urban Glazing Designs',
            types: [
              {
                name: 'Fabian',
                image: '/assets/urban-door-collection16.svg',
              },
              {
                name: 'Harmony',
                image: '/assets/urban-door-collection17.svg',
              },
              {
                name: 'Comete',
                image: '/assets/urban-door-collection18.svg',
              },
              {
                name: 'Virtue',
                image: '/assets/urban-door-collection19.svg',
              },
              {
                name: 'Clarence',
                image: '/assets/urban-door-collection20.svg',
              },
              {
                name: 'Olympias',
                image: '/assets/urban-door-collection21.svg',
              },
            ],
          },
        ],
      },
      {
        name: 'Avantal Collections',
        image: '/assets/avantal-door-collection.svg',
        styles: {
          name: 'Popular Avantal Styles',
          image: [
            '/assets/avantal-door-collection1.svg',
            '/assets/avantal-door-collection2.svg',
            '/assets/avantal-door-collection3.svg',
            '/assets/avantal-door-collection4.svg',
            '/assets/avantal-door-collection5.svg',
          ],
        },
        details: [
          {
            name: 'Avantal Accessories',
            types: [
              {
                name: 'Lever Handle',
                image: '/assets/avantal-door-collection6.svg',
              },
              {
                name: 'Knocker',
                image: '/assets/avantal-door-collection7.svg',
              },
              {
                name: 'Pull Bar',
                image: '/assets/avantal-door-collection8.svg',
              },
              {
                name: 'Round Pull Knob',
                image: '/assets/avantal-door-collection9.svg',
              },
              {
                name: 'Square Pull Knob',
                image: '/assets/avantal-door-collection10.svg',
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   id: 13,
  //   seoImage: '/assets/urban-collection.jpg',
  //   image: '/assets/urban-collection.svg',
  //   title: 'Urban Collection',
  //   category: 'composite-doors',
  //   heroImage: '',
  // },
  // {
  //   id: 14,
  //   seoImage: '/assets/country-collection.jpg',
  //   image: '/assets/country-collection.svg',
  //   title: 'Avantal Collection',
  //   category: 'composite-doors',
  //   heroImage: '',
  // },
  // fencing
  {
    id: 17,
    seoImage: '/assets/Woven-Wood-Fence-Panels.jpg',
    image: '/assets/Woven-Wood-Fence-Panels.svg',
    title: 'Wooden Woove Fence Panel',
    category: 'fencing',
    brand: 'Todotipo',
    model: 'SP-OR05L',
    code: 'SP-OR',
    heroImage: [
      '/assets/fence.svg',
      '/assets/fence4.svg',
      '/assets/fence2.svg',
      '/assets/fence3.svg',
      '/assets/fence1.svg',
    ],
    addOns: [
      {
        image: '/assets/water-proof.svg',
        name: 'Water Proof',
      },
      {
        image: '/assets/insect-prevention.svg',
        name: 'Insect prevention',
      },
      {
        image: '/assets/eco.svg',
        name: '100% Eco Material',
      },
      {
        image: '/assets/uv.svg',
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
    designSketches: [
      '/assets/fence6.svg',
      '/assets/fence7.svg',
      '/assets/fence8.svg',
      '/assets/fence9.svg',
    ],
  },
];

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

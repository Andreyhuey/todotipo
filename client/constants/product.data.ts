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
interface Products {
  id: number | string;
  image: string;
  title: string;
  category: ProductCategoryValue;
}

export const products: Products[] = [
  // Decking
  {
    id: 1,
    image: '/assets/solid-decking-board.svg',
    title: 'Solid Decking Board',
    category: 'decking',
  },
  {
    id: 2,
    image: '/assets/hollow-decking-board.svg',
    title: 'Hollow Decking Board',
    category: 'decking',
  },
  {
    id: 3,
    image: '/assets/composite-decking-board.svg',
    title: 'Composite Decking Board',
    category: 'decking',
  },
  // flutted wall panels
  {
    id: 4,
    image: '/assets/flutted-wall-panel.svg',
    title: 'Flutted wall panel information',
    category: 'flutted-wall-panel',
  },
  {
    id: 5,
    image: '/assets/bamboo-corner-wall.svg',
    title: 'Bamboo charcoal wood grille',
    category: 'flutted-wall-panel',
  },
  {
    id: 6,
    image: '/assets/bamboo-wood-grille.svg',
    title: 'Bamboo wood grille',
    category: 'flutted-wall-panel',
  },
  // wall-panels
  {
    id: 7,
    image: '/assets/hd-printing-wall-panel.svg',
    title: 'HD Printing wall panel',
    category: 'wall-panels',
  },
  {
    id: 8,
    image: '/assets/spc-hd-wood-grain.svg',
    title: 'SPC/HD Wood Grain',
    category: 'wall-panels',
  },
  {
    id: 9,
    image: '/assets/metal-series-wall-panel.svg',
    title: 'Metal Series wall panel',
    category: 'wall-panels',
  },
  {
    id: 10,
    image: '/assets/stone-series-wall-panel.svg',
    title: 'Stone Series Wall Panel',
    category: 'wall-panels',
  },
  {
    id: 11,
    image: '/assets/wood-grain-series-wall-panel.svg',
    title: 'Wood Grain Series Wall Panel',
    category: 'wall-panels',
  },
  // composite-doors
  {
    id: 12,
    image: '/assets/classic-collection.svg',
    title: 'Classic Collection',
    category: 'composite-doors',
  },
  {
    id: 13,
    image: '/assets/urban-collection.svg',
    title: 'Urban Collection',
    category: 'composite-doors',
  },
  {
    id: 15,
    image: '/assets/country-collection.svg',
    title: 'Country Collection',
    category: 'composite-doors',
  },
  {
    id: 16,
    image: '/assets/composite-door-information.svg',
    title: 'Composite Door Information',
    category: 'composite-doors',
  },
  // fencing
  {
    id: 17,
    image: '/assets/Woven-Wood-Fence-Panels.svg',
    title: 'Wooden Woove Fence Panels',
    category: 'fencing',
  },
  {
    id: 18,
    image: '/assets/slate-wall-fence.svg',
    title: 'Slate Wall Fence',
    category: 'fencing',
  },
  // gates
  // {
  //   id: 22,
  //   image: '/assets/premium1.svg',
  //   title: 'Black Gate',
  //   category: 'gates',
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
];

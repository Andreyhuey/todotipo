export interface DesignCaseProps {
  id: number | string;
  name: string;
  overview: string;
  settings: string[];
  description: string;
  highlights: string[];
  audience: string[];
  image: string[];
  seoImage: string;
}

export const designCases: DesignCaseProps[] = [
  {
    id: '7',
    name: 'Backyard Oasis',
    overview:
      'A serene living space elevated with sustainable WPC solutions, blending style, durability, and eco-consciousness.',
    settings: ['Residential', 'Decking', 'Fencing', 'Aesthetic'],
    description:
      'Stunning outdoor living spaces transformed by installing composite decking and WPC fencing. Now, a beautiful, low-maintenance area for relaxation and entertainment with added privacy. Todotipo’s rich teak-brown WPC decking, crafted from recycled materials with hidden fasteners, offers a seamless, weather-resistant surface. The matching WPC fence, with its natural wood-grain finish, ensures seclusion while enhancing the aesthetic. Both feature UV resistance and easy upkeep, creating an inviting haven for family gatherings or quiet escapes.',
    highlights: [
      'Eco-friendly, 100% recyclable materials',
      'UV-resistant and weatherproof design',
      'Minimal maintenance for long-term enjoyment',
    ],
    audience: ['Homeowners', 'Contractors', 'Landscape designers'],
    image: [
      '/assets/backyard1.svg',
      '/assets/backyard2.svg',
      '/assets/backyard3.svg',
    ],
    seoImage: '/assets/backyard.jpg',
  },
  {
    id: '8',
    name: 'Modernized Homespace',
    overview: 'Elevate Interiors with Sleek, Sustainable Panels',
    settings: ['Urban', 'Residential', 'Wall panels', 'Durability'],
    description:
      'Enhancing and modernizing a homespace by installing high-end wall panels and metal lines which enhances and gives the space a sleek, contemporary look. Todotipo’s walnut-brown WPC panels, crafted from recycled materials, deliver a rich, high-definition wood-grain texture, while integrated metallic lines in brushed silver add a modern edge. The moisture-resistant, eco-friendly design transforms the interior into a sophisticated retreat, blending sustainability with timeless style.',
    highlights: [
      'Eco-friendly, 100% recyclable materials',
      'Moisture-resistant for indoor durability',
      'Sleek metallic accents for a contemporary finish',
    ],
    audience: ['Homeowners', 'Architects', 'Interior designers'],
    image: [
      '/assets/homespace1.svg',
      '/assets/homespace2.svg',
      '/assets/homespace3.svg',
    ],
    seoImage: '/assets/homespace.jpg',
  },
  {
    id: '9',
    name: 'Green Haven',
    overview: ' A Sustainable Sanctuary with WPC Solutions',
    settings: ['Public Space', 'Simple', 'Fences', 'Bench', 'Park'],
    description:
      'An eco-friendly WPC benches and composite fence providing a sustainable and durable solution for this space. The benches blend seamlessly with the natural surroundings, offering a warm, wood-grain finish crafted from recycled materials. The gate, with its sturdy composite construction and fade-resistant design, ensures secure access while enhancing the aesthetic. Both feature UV resistance and low maintenance, creating a welcoming haven that respects the environment.',
    highlights: [
      'Eco-friendly, 100% recyclable materials',
      'UV-resistant and fade-resistant design',
      'Low maintenance for enduring use',
    ],
    audience: ['Homeowners', 'Contractors', 'Municipal Clients'],
    image: ['/assets/haven1.svg', '/assets/haven2.svg', '/assets/haven.svg'],
    seoImage: '/assets/haven.jpg',
  },
  {
    id: '10',
    name: 'Prestigious Residence',
    overview: 'Luxury Living with Sustainable Designs',
    settings: [
      'Residential',
      'Doors',
      'Wall Panels',
      'Complex',
      'High End property',
    ],
    description:
      'Residential project showcasing the versatility of composite doors and wall panel designs, adding elegance and sophistication to the property. The unique patterns and finishes highlight innovative craftsmanship, with Todotipo’s walnut-brown WPC doors offering durable, moisture-resistant elegance and SPC wall panels in marble-white featuring high-definition textures. Crafted from recycled materials, these designs elevate the home’s aesthetic while promoting sustainability.',
    highlights: [
      'Eco-friendly, 100% recyclable materials',
      'Moisture-resistant doors for longevity',
      'High-definition textures for timeless style',
    ],
    audience: ['Homeowners', 'Architects', 'Interior designers'],
    image: [
      '/assets/prestigious1.svg',
      '/assets/prestigious2.svg',
      '/assets/prestigious3.svg',
    ],
    seoImage: '/assets/prestigious.jpg',
  },
  {
    id: '11',
    name: 'Busy Boutiques',
    overview: 'Sustainable Decking for Thriving Retail Spaces',
    settings: ['Commercial', 'Decking', 'Fencing', 'Aesthetics'],
    description:
      'An eco-friendly shopping store utilizing durable WPC decking that withstands heavy foot traffic in this bustling retail environment while maintaining its aesthetic appeal. Composite gates, crafted from Todotipo’s recycled WPC materials, provide secure yet stylish entry points. The warm oak-toned decking, with its scratch-resistant and fade-proof finish, complements the gates’ sleek design, ensuring a sustainable, low-maintenance solution that enhances the store’s vibrant atmosphere.',
    highlights: [
      'Eco-friendly, 100% recyclable materials',
      'Scratch-resistant and fade-proof decking',
      'Low-maintenance for high-traffic areas',
    ],
    audience: ['Business Owners', 'Architects', 'Commercial Contractors'],
    image: ['/assets/busy1.svg', '/assets/busy2.svg', '/assets/busy3.svg'],
    seoImage: '/assets/busy.jpg',
  },
  {
    id: '12',
    name: 'Luxurious Hotel',
    overview: 'Elegant Interiors with Sustainable Panels',
    settings: ['Commercial', 'Decking', 'WPC Panel', 'Aesthetics'],
    description:
      'A trendy hotel installed with sophisticated, eco-friendly SPC background wall in marble white and fluted WPC panels in walnut brown creating a warm, modern ambiance. Todotipo’s recyclable SPC walls offer a pristine, moisture-resistant finish, while the fluted WPC panels add texture and sound-dampening qualities. Crafted from sustainable materials, this design elevates guest experiences with a luxurious yet eco-conscious atmosphere.',
    highlights: [
      'Eco-friendly, 100% recyclable materials',
      'Sound-dampening fluted panels for comfort',
      'Moisture-resistant SPC for durability',
    ],
    audience: ['Business Owners', 'Architects', 'Interior Designers'],
    image: ['/assets/hotel1.svg', '/assets/hotel2.svg', '/assets/hotel3.svg'],
    seoImage: '/assets/hotel.jpg',
  },
];

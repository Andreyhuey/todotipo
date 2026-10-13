import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export interface SpecRow {
  name: string;
  value: string;
}

export interface BlockItem {
  image: string;
  name?: string;
}

/**
 * Flexible content blocks rendered below a product's description.
 *  - gallery:  full-width images, stacked
 *  - swatches: captioned image grid (colours, finishes, styles…)
 *  - features: small icon + label grid (waterproof, flame retardant…)
 *  - specs:    a key/value table
 */
export interface ContentBlock {
  type: 'gallery' | 'swatches' | 'features' | 'specs';
  title?: string;
  columns?: number;
  items?: BlockItem[];
  specs?: SpecRow[];
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  slug: string;

  /** Category slug (kept denormalised so URLs stay stable). */
  @Index()
  @Column({ length: 150 })
  category: string;

  @Column({ length: 500, default: '' })
  summary: string;

  @Column({ length: 100, default: '' })
  brand: string;

  @Column({ length: 100, default: '' })
  model: string;

  @Column({ length: 100, default: '' })
  code: string;

  @Column({ length: 1024, default: '' })
  image: string;

  @Column({ length: 1024, default: '' })
  seoImage: string;

  @Column({ type: 'simple-json' })
  gallery: string[];

  @Column({ type: 'simple-json' })
  description: string[];

  @Column({ length: 1024, default: '' })
  video: string;

  @Column({ type: 'simple-json' })
  specifications: SpecRow[];

  @Column({ type: 'simple-json' })
  blocks: ContentBlock[];

  @Column({ default: false })
  featured: boolean;

  @Column({ default: true })
  published: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

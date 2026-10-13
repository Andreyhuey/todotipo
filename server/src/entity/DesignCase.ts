import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('design_cases')
export class DesignCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  slug: string;

  @Column({ length: 500, default: '' })
  overview: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 150, default: '' })
  location: string;

  @Column({ type: 'simple-json' })
  tags: string[];

  @Column({ type: 'simple-json' })
  highlights: string[];

  @Column({ type: 'simple-json' })
  audience: string[];

  @Column({ length: 1024, default: '' })
  coverImage: string;

  @Column({ type: 'simple-json' })
  images: string[];

  @Column({ length: 1024, default: '' })
  seoImage: string;

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

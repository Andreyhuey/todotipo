import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1024 })
  url: string;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 255, default: '' })
  originalName: string;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ type: 'int', default: 0 })
  size: number;

  @Column({ type: 'int', nullable: true })
  width: number | null;

  @Column({ type: 'int', nullable: true })
  height: number | null;

  @Column({ length: 255, default: '' })
  alt: string;

  /** Logical grouping in the library, e.g. "products", "branding". */
  @Column({ length: 100, default: 'general' })
  folder: string;

  /** Original path for items imported from the legacy static site. */
  @Column({ type: 'varchar', length: 512, nullable: true })
  legacyPath: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

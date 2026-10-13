import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/** A contact-form message or product quote request, kept for the admin inbox. */
@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  type: 'contact' | 'quote';

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 100, default: '' })
  phone: string;

  @Column({ length: 255, default: '' })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  /** Extra quote fields (product, quantity, address, project type, link). */
  @Column({ type: 'simple-json' })
  meta: Record<string, string>;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

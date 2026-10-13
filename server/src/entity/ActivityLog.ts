import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type LogLevel = 'info' | 'warning' | 'error';
export type LogCategory = 'auth' | 'security' | 'content' | 'media' | 'settings' | 'users' | 'inbox' | 'system';
export type ActorType = 'admin' | 'visitor' | 'system';

/** One entry in the platform's activity log (admin changes, sign-ins, forms, system events). */
@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Index()
  @Column({ length: 10, default: 'info' })
  level: LogLevel;

  @Index()
  @Column({ length: 20 })
  category: LogCategory;

  /** Machine-readable event name, e.g. "product.updated". */
  @Column({ length: 60 })
  action: string;

  /** Human-readable summary shown in the log. */
  @Column({ length: 500 })
  message: string;

  @Column({ length: 10, default: 'system' })
  actorType: ActorType;

  @Column({ type: 'int', nullable: true })
  actorId: number | null;

  @Column({ length: 255, default: '' })
  actorEmail: string;

  @Column({ length: 64, default: '' })
  ip: string;

  @Column({ length: 512, default: '' })
  userAgent: string;

  @Column({ length: 40, default: '' })
  targetType: string;

  @Column({ length: 64, default: '' })
  targetId: string;

  @Column({ length: 255, default: '' })
  targetLabel: string;

  /** Extra detail: changed fields, request info, error text… */
  @Column({ type: 'simple-json' })
  meta: Record<string, unknown>;

  /** When this entry was included in an alert email (warnings/errors only). */
  @Index()
  @Column({ type: 'timestamp', nullable: true })
  alertedAt: Date | null;
}

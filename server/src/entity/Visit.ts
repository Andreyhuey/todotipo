import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * One page view on the public site. Location fields are filled in
 * asynchronously from the IP geolocation lookup (see GeoService).
 */
@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  /** Long-lived browser id (localStorage) — counts unique visitors. */
  @Index()
  @Column({ length: 64 })
  visitorId: string;

  /** Per-tab session id (sessionStorage) — counts sessions/bounces. */
  @Index()
  @Column({ length: 64 })
  sessionId: string;

  @Column({ length: 512 })
  path: string;

  @Column({ length: 255, default: '' })
  title: string;

  @Column({ length: 1024, default: '' })
  referrer: string;

  /** Hostname of the referrer, or '' for direct / same-site. */
  @Column({ length: 255, default: '' })
  referrerHost: string;

  @Column({ length: 64 })
  ip: string;

  @Column({ length: 512, default: '' })
  userAgent: string;

  @Column({ length: 50, default: '' })
  browser: string;

  @Column({ length: 50, default: '' })
  os: string;

  /** desktop | mobile | tablet */
  @Column({ length: 20, default: '' })
  device: string;

  @Column({ length: 20, default: '' })
  screen: string;

  @Column({ length: 20, default: '' })
  language: string;

  @Column({ length: 100, default: '' })
  country: string;

  @Index()
  @Column({ length: 2, default: '' })
  countryCode: string;

  @Column({ length: 100, default: '' })
  region: string;

  @Column({ length: 100, default: '' })
  city: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @Column({ length: 255, default: '' })
  isp: string;

  @Column({ length: 100, default: '' })
  timezone: string;

  /** Seconds spent on the page (reported when the visitor leaves). */
  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}

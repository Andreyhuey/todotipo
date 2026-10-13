import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

/** Cached ipgeolocation.io response per IP, so repeat visits cost no credits. */
@Entity('ip_geo')
export class IpGeo {
  @PrimaryColumn({ length: 64 })
  ip: string;

  /** Full API response, or `{ error }` when the lookup failed. */
  @Column({ type: 'simple-json' })
  data: Record<string, any>;

  @UpdateDateColumn()
  fetchedAt: Date;
}

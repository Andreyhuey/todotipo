import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

/**
 * Key/value store for site-wide editable content. Each key holds one JSON
 * document (e.g. "site", "home", "about") whose shape is defined in
 * services/SettingsService.ts.
 */
@Entity('settings')
export class Setting {
  @PrimaryColumn({ length: 100 })
  key: string;

  @Column({ type: 'simple-json' })
  value: Record<string, unknown>;

  @UpdateDateColumn()
  updatedAt: Date;
}

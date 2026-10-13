'use client';

import { PageHeader } from '@/components/admin/shell';
import { Card, ImageField, SaveBar, StringListField, TextAreaField, TextField } from '@/components/admin/fields';
import { useSettingsSection } from '@/lib/admin/use-settings';

export default function SiteSettingsPage() {
  const site = useSettingsSection('site');
  const seo = useSettingsSection('seo');
  const s = site.draft;
  const m = seo.draft;

  if (!s || !m) return <p className="text-stone-500">Loading…</p>;

  const dirty = site.dirty || seo.dirty;
  const save = () => {
    if (site.dirty) site.save();
    if (seo.dirty) seo.save();
  };

  return (
    <>
      <PageHeader title="Site settings" description="Brand, contact details and search engine defaults." />
      <div className="flex flex-col gap-6">
        <Card title="Brand">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Site name" value={s.name} onChange={(v) => site.update((d) => void (d.name = v))} />
            <TextField label="Tagline" value={s.tagline} onChange={(v) => site.update((d) => void (d.tagline = v))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <ImageField
              label="Logo (dark)"
              hint="For light backgrounds. SVG or transparent PNG."
              folder="branding"
              aspect="aspect-[3/1]"
              value={s.logo}
              onChange={(v) => site.update((d) => void (d.logo = v))}
            />
            <ImageField
              label="Logo (light)"
              hint="For dark backgrounds and the footer."
              folder="branding"
              aspect="aspect-[3/1]"
              value={s.logoLight}
              onChange={(v) => site.update((d) => void (d.logoLight = v))}
            />
            <ImageField
              label="Favicon"
              hint="Square, at least 512×512."
              folder="branding"
              aspect="aspect-square max-w-[140px]"
              value={s.favicon}
              onChange={(v) => site.update((d) => void (d.favicon = v))}
            />
          </div>
          <p className="text-xs text-stone-500">Without an uploaded logo the site shows the name as a styled wordmark.</p>
          <TextAreaField label="Footer text" rows={3} value={s.footerBlurb} onChange={(v) => site.update((d) => void (d.footerBlurb = v))} />
        </Card>

        <Card title="Contact details" description="Shown in the footer and on the contact page.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Public email" type="email" value={s.email} onChange={(v) => site.update((d) => void (d.email = v))} />
            <TextField label="Phone" value={s.phone} onChange={(v) => site.update((d) => void (d.phone = v))} />
            <TextField label="Address" value={s.address} onChange={(v) => site.update((d) => void (d.address = v))} />
            <TextField label="Opening hours" value={s.hours} onChange={(v) => site.update((d) => void (d.hours = v))} />
          </div>
          <TextField
            label="Notification email"
            type="email"
            hint="Where contact-form and quote notifications are sent. Not shown publicly."
            value={s.notifyEmail ?? ''}
            onChange={(v) => site.update((d) => void (d.notifyEmail = v))}
          />
        </Card>

        <Card title="Social links" description="Leave empty to hide an icon.">
          <div className="grid gap-4 sm:grid-cols-2">
            {(['instagram', 'facebook', 'linkedin', 'x', 'youtube'] as const).map((k) => (
              <TextField
                key={k}
                label={k === 'x' ? 'X (Twitter)' : k[0].toUpperCase() + k.slice(1)}
                placeholder="https://"
                value={s.socials[k]}
                onChange={(v) => site.update((d) => void (d.socials[k] = v))}
              />
            ))}
          </div>
        </Card>

        <Card title="Search & sharing" description="Defaults for pages without their own title or description.">
          <TextField label="Default title" value={m.title} onChange={(v) => seo.update((d) => void (d.title = v))} />
          <TextAreaField
            label="Default description"
            hint="Around 150 characters works best in search results."
            rows={3}
            value={m.description}
            onChange={(v) => seo.update((d) => void (d.description = v))}
          />
          <StringListField label="Keywords" addLabel="Add keyword" value={m.keywords} onChange={(v) => seo.update((d) => void (d.keywords = v))} />
          <ImageField
            label="Default social share image"
            hint="1200×630 recommended."
            folder="branding"
            aspect="aspect-[1200/630] max-w-md"
            value={s.ogImage}
            onChange={(v) => site.update((d) => void (d.ogImage = v))}
          />
        </Card>
      </div>

      <SaveBar
        dirty={dirty}
        saving={site.saving || seo.saving}
        onSave={save}
        onDiscard={() => {
          site.discard();
          seo.discard();
        }}
      />
    </>
  );
}

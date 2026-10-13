'use client';

import {
  Card,
  Field,
  IconSelect,
  ImageField,
  Repeater,
  SaveBar,
  StringListField,
  TextAreaField,
  TextField,
} from './fields';
import { useSettingsSection } from '@/lib/admin/use-settings';
import type { PageHero } from '@/types/cms';

const Loading = () => <p className="text-stone-500">Loading…</p>;

function HeroFields({
  hero,
  onChange,
  folder = 'pages',
}: {
  hero: PageHero;
  onChange: (patch: Partial<PageHero>) => void;
  folder?: string;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_280px]">
      <div className="flex flex-col gap-4">
        <TextField label="Eyebrow" hint="Small label above the title." value={hero.eyebrow} onChange={(eyebrow) => onChange({ eyebrow })} />
        <TextField label="Title" value={hero.title} onChange={(title) => onChange({ title })} />
        <TextAreaField label="Subtitle" rows={3} value={hero.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </div>
      <ImageField label="Background image" folder={folder} aspect="aspect-[4/3]" value={hero.image} onChange={(image) => onChange({ image })} />
    </div>
  );
}

// ---- Home --------------------------------------------------------------------

export function HomeEditor() {
  const { draft: h, update, dirty, isLoading, save, discard, saving } = useSettingsSection('home');
  if (isLoading || !h) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <Card title="Hero" description="The full-screen opening section. Slides rotate automatically.">
        <TextField label="Eyebrow" value={h.hero.eyebrow} onChange={(v) => update((d) => void (d.hero.eyebrow = v))} />
        <TextField label="Headline" value={h.hero.title} onChange={(v) => update((d) => void (d.hero.title = v))} />
        <TextAreaField label="Subtitle" rows={3} value={h.hero.subtitle} onChange={(v) => update((d) => void (d.hero.subtitle = v))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Primary button label" value={h.hero.primaryCta.label} onChange={(v) => update((d) => void (d.hero.primaryCta.label = v))} />
          <TextField label="Primary button link" value={h.hero.primaryCta.href} onChange={(v) => update((d) => void (d.hero.primaryCta.href = v))} />
          <TextField label="Secondary button label" value={h.hero.secondaryCta.label} onChange={(v) => update((d) => void (d.hero.secondaryCta.label = v))} />
          <TextField label="Secondary button link" value={h.hero.secondaryCta.href} onChange={(v) => update((d) => void (d.hero.secondaryCta.href = v))} />
        </div>
        <Repeater
          label="Slides"
          hint="Landscape photos at least 2000px wide look best."
          items={h.hero.slides}
          onChange={(v) => update((d) => void (d.hero.slides = v))}
          create={() => ({ image: '', caption: '' })}
          addLabel="Add slide"
          itemLabel={(s, i) => s.caption || `Slide ${i + 1}`}
          render={(s, upd) => (
            <div className="grid gap-4 sm:grid-cols-[240px_1fr]">
              <ImageField label="Image" folder="pages" value={s.image} onChange={(image) => upd({ image })} />
              <TextField label="Caption" value={s.caption} onChange={(caption) => upd({ caption })} />
            </div>
          )}
        />
      </Card>

      <Card title="Stats strip" description="Short proof points under the hero.">
        <Repeater
          items={h.stats}
          onChange={(v) => update((d) => void (d.stats = v))}
          create={() => ({ value: '', label: '' })}
          addLabel="Add stat"
          itemLabel={(s) => `${s.value} ${s.label}`.trim() || 'Stat'}
          render={(s, upd) => (
            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <TextField label="Value" value={s.value} onChange={(value) => upd({ value })} placeholder="95%" />
              <TextField label="Label" value={s.label} onChange={(label) => upd({ label })} />
            </div>
          )}
        />
      </Card>

      <Card title="Introduction">
        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-4">
            <TextField label="Eyebrow" value={h.intro.eyebrow} onChange={(v) => update((d) => void (d.intro.eyebrow = v))} />
            <TextField label="Title" value={h.intro.title} onChange={(v) => update((d) => void (d.intro.title = v))} />
            <TextAreaField label="Body" rows={6} value={h.intro.body} onChange={(v) => update((d) => void (d.intro.body = v))} />
          </div>
          <ImageField label="Image" folder="pages" aspect="aspect-[4/5]" value={h.intro.image} onChange={(v) => update((d) => void (d.intro.image = v))} />
        </div>
      </Card>

      <Card title="Why choose us">
        <TextField label="Title" value={h.whyUs.title} onChange={(v) => update((d) => void (d.whyUs.title = v))} />
        <TextField label="Subtitle" value={h.whyUs.subtitle} onChange={(v) => update((d) => void (d.whyUs.subtitle = v))} />
        <Repeater
          items={h.whyUs.items}
          onChange={(v) => update((d) => void (d.whyUs.items = v))}
          create={() => ({ icon: 'leaf', title: '', body: '' })}
          addLabel="Add reason"
          itemLabel={(it) => it.title || 'Reason'}
          render={(it, upd) => (
            <>
              <Field label="Icon">
                <IconSelect value={it.icon} onChange={(icon) => upd({ icon })} />
              </Field>
              <TextField label="Title" value={it.title} onChange={(title) => upd({ title })} />
              <TextAreaField label="Text" rows={2} value={it.body} onChange={(body) => upd({ body })} />
            </>
          )}
        />
      </Card>

      <Card title="Testimonials" description="Hidden on the site until at least one is added.">
        <Repeater
          items={h.testimonials}
          onChange={(v) => update((d) => void (d.testimonials = v))}
          create={() => ({ quote: '', author: '', role: '' })}
          addLabel="Add testimonial"
          itemLabel={(t) => t.author || 'Testimonial'}
          render={(t, upd) => (
            <>
              <TextAreaField label="Quote" rows={3} value={t.quote} onChange={(quote) => upd({ quote })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Name" value={t.author} onChange={(author) => upd({ author })} />
                <TextField label="Role / company" value={t.role} onChange={(role) => upd({ role })} />
              </div>
            </>
          )}
        />
      </Card>

      <Card title="Call to action banner" description="Also shown on the About and Design cases pages.">
        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-4">
            <TextField label="Title" value={h.cta.title} onChange={(v) => update((d) => void (d.cta.title = v))} />
            <TextAreaField label="Text" rows={3} value={h.cta.body} onChange={(v) => update((d) => void (d.cta.body = v))} />
            <TextField label="Button label" value={h.cta.buttonLabel} onChange={(v) => update((d) => void (d.cta.buttonLabel = v))} />
          </div>
          <ImageField label="Background image" folder="pages" aspect="aspect-[4/3]" value={h.cta.image} onChange={(v) => update((d) => void (d.cta.image = v))} />
        </div>
      </Card>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}

// ---- About -------------------------------------------------------------------

export function AboutEditor() {
  const { draft: a, update, dirty, isLoading, save, discard, saving } = useSettingsSection('about');
  if (isLoading || !a) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <Card title="Header">
        <HeroFields hero={a.hero} onChange={(p) => update((d) => void Object.assign(d.hero, p))} />
      </Card>
      <Card title="Introduction">
        <StringListField label="Paragraphs" multiline addLabel="Add paragraph" value={a.intro} onChange={(v) => update((d) => void (d.intro = v))} />
      </Card>
      <Card title="Mission & vision">
        <TextAreaField label="Mission" rows={3} value={a.mission} onChange={(v) => update((d) => void (d.mission = v))} />
        <TextAreaField label="Vision" rows={3} value={a.vision} onChange={(v) => update((d) => void (d.vision = v))} />
      </Card>
      <Card title="Our story">
        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-4">
            <TextField label="Title" value={a.story.title} onChange={(v) => update((d) => void (d.story.title = v))} />
            <StringListField
              label="Paragraphs"
              multiline
              addLabel="Add paragraph"
              value={a.story.paragraphs}
              onChange={(v) => update((d) => void (d.story.paragraphs = v))}
            />
          </div>
          <ImageField label="Image" folder="pages" aspect="aspect-[4/5]" value={a.story.image} onChange={(v) => update((d) => void (d.story.image = v))} />
        </div>
      </Card>
      <Card title="Core values">
        <Repeater
          items={a.values}
          onChange={(v) => update((d) => void (d.values = v))}
          create={() => ({ icon: 'leaf', title: '', body: '', image: '' })}
          addLabel="Add value"
          itemLabel={(v) => v.title || 'Value'}
          render={(v, upd) => (
            <div className="grid gap-4 md:grid-cols-[1fr_200px]">
              <div className="flex flex-col gap-4">
                <TextField label="Title" value={v.title} onChange={(title) => upd({ title })} />
                <TextAreaField label="Text" rows={2} value={v.body} onChange={(body) => upd({ body })} />
                <Field label="Icon">
                  <IconSelect value={v.icon} onChange={(icon) => upd({ icon })} />
                </Field>
              </div>
              <ImageField label="Background" folder="pages" aspect="aspect-[4/5]" value={v.image ?? ''} onChange={(image) => upd({ image })} />
            </div>
          )}
        />
      </Card>
      <Card title="Sustainability">
        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-4">
            <TextField label="Title" value={a.sustainability.title} onChange={(v) => update((d) => void (d.sustainability.title = v))} />
            <TextAreaField label="Text" rows={4} value={a.sustainability.body} onChange={(v) => update((d) => void (d.sustainability.body = v))} />
          </div>
          <ImageField
            label="Image"
            folder="pages"
            aspect="aspect-[4/5]"
            value={a.sustainability.image}
            onChange={(v) => update((d) => void (d.sustainability.image = v))}
          />
        </div>
        <Repeater
          label="Figures"
          items={a.sustainability.items}
          onChange={(v) => update((d) => void (d.sustainability.items = v))}
          create={() => ({ value: '', label: '' })}
          addLabel="Add figure"
          itemLabel={(s) => s.value || 'Figure'}
          render={(s, upd) => (
            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <TextField label="Value" value={s.value} onChange={(value) => upd({ value })} />
              <TextField label="Label" value={s.label} onChange={(label) => upd({ label })} />
            </div>
          )}
        />
      </Card>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}

// ---- Page headers --------------------------------------------------------------

export function HeadersEditor() {
  const { draft: p, update, dirty, isLoading, save, discard, saving } = useSettingsSection('pages');
  if (isLoading || !p) return <Loading />;

  const sections = [
    { key: 'products', title: 'Products page' },
    { key: 'designCases', title: 'Design cases page' },
    { key: 'contact', title: 'Contact page' },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      {sections.map(({ key, title }) => (
        <Card key={key} title={title}>
          <HeroFields hero={p[key]} onChange={(patch) => update((d) => void Object.assign(d[key], patch))} />
        </Card>
      ))}
      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}

// ---- Legal -------------------------------------------------------------------

export function LegalEditor() {
  const { draft: l, update, dirty, isLoading, save, discard, saving } = useSettingsSection('legal');
  if (isLoading || !l) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <Card
        title="Formatting"
        description='Separate paragraphs with a blank line. Start a line with "## " to make it a heading.'
      >
        <TextField
          label="Last updated"
          placeholder="e.g. 12 October 2026"
          value={l.updatedAt}
          onChange={(v) => update((d) => void (d.updatedAt = v))}
        />
      </Card>
      <Card title="Privacy policy">
        <TextAreaField label="Content" rows={18} value={l.privacy} onChange={(v) => update((d) => void (d.privacy = v))} />
      </Card>
      <Card title="Terms & conditions">
        <TextAreaField label="Content" rows={18} value={l.terms} onChange={(v) => update((d) => void (d.terms = v))} />
      </Card>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}

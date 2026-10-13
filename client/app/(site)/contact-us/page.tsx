import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import PageHero from '@/components/site/page-hero';
import ContactForm from '@/components/contact-form';
import { getSite } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import { routes } from '@/lib/routes';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSite();
  return buildMetadata({
    title: 'Contact us',
    description: pages.contact.subtitle,
    path: routes.contactUs(),
  });
}

export default async function ContactPage() {
  const { site, pages } = await getSite();

  const details = [
    site.email && { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    site.phone && { icon: Phone, label: 'Phone', value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, '')}` },
    site.address && { icon: MapPin, label: 'Office', value: site.address },
    site.hours && { icon: Clock, label: 'Hours', value: site.hours },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero hero={pages.contact} />

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="display-3">Speak with a materials specialist</h2>
              <p className="lead">
                Whether you&apos;re specifying for a large commercial build or refreshing a backyard deck, we&apos;ll help you
                choose the right product, finish and quantity.
              </p>
            </div>
            {details.length > 0 && (
              <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-white">
                {details.map(({ icon: IconCmp, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4 p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-linen text-oak-600">
                      <IconCmp className="size-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-stone-500">{label}</p>
                      {href ? (
                        <a href={href} className="font-medium text-ink hover:text-oak-700">
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium text-ink">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[28px] border border-border bg-white p-6 shadow-soft md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

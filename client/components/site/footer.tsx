import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { routes } from '@/lib/routes';
import Logo from './logo';
import NewsletterForm from './newsletter-form';
import type { Category, SiteSettings } from '@/types/cms';

interface Props {
  site: SiteSettings;
  categories: Category[];
}

const company = [
  { name: 'About us', href: routes.aboutUs() },
  { name: 'Design cases', href: routes.designCase() },
  { name: 'All products', href: routes.products() },
  { name: 'Contact', href: routes.contactUs() },
];

export default function Footer({ site, categories }: Props) {
  const socials = [
    { href: site.socials.instagram, label: 'Instagram', Icon: Instagram },
    { href: site.socials.facebook, label: 'Facebook', Icon: Facebook },
    { href: site.socials.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: site.socials.x, label: 'X', Icon: Twitter },
    { href: site.socials.youtube, label: 'YouTube', Icon: Youtube },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden bg-forest-900 text-linen/70">
      <div className="container">
        {/* Newsletter band */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="display-3 text-linen">Ideas and new materials, a few times a year.</h2>
            <p className="mt-3 text-linen/60">
              Product launches, project inspiration and installation tips — no spam.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <Logo name={site.name} logo={site.logo} logoLight={site.logoLight} tone="light" />
            <p className="max-w-sm text-[15px] leading-relaxed">{site.footerBlurb}</p>
            {socials.length > 0 && (
              <div className="flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-oak-300 hover:text-oak-200"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn title="Products">
            {categories.map((c) => (
              <FooterLink key={c.id} href={routes.productCategory(c.slug)}>
                {c.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {company.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Get in touch">
            {site.email && (
              <a href={`mailto:${site.email}`} className="flex items-start gap-3 hover:text-linen">
                <Mail className="mt-0.5 size-4 shrink-0 text-oak-300" /> {site.email}
              </a>
            )}
            {site.phone && (
              <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} className="flex items-start gap-3 hover:text-linen">
                <Phone className="mt-0.5 size-4 shrink-0 text-oak-300" /> {site.phone}
              </a>
            )}
            {site.address && (
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-oak-300" /> {site.address}
              </p>
            )}
            {site.hours && <p className="text-sm text-linen/50">{site.hours}</p>}
          </FooterColumn>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="container -mb-[0.22em] whitespace-nowrap font-display text-[24vw] font-light leading-none text-white/[0.04] lg:text-[19rem]">
          {site.name}
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-[13px] text-linen/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href={routes.privacy()} className="hover:text-linen">
              Privacy policy
            </Link>
            <Link href={routes.terms()} className="hover:text-linen">
              Terms & conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-oak-300">{title}</p>
      <div className="flex flex-col gap-3 text-[15px]">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="w-fit transition-colors hover:text-linen">
      {children}
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Logo from './logo';
import CmsImage from './cms-image';
import type { Category, SiteSettings } from '@/types/cms';

interface Props {
  site: SiteSettings;
  categories: Category[];
}

const links = [
  { name: 'Design cases', href: routes.designCase() },
  { name: 'About', href: routes.aboutUs() },
  { name: 'Contact', href: routes.contactUs() },
];

export default function Navbar({ site, categories }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  // Every public page opens on a dark hero, so the bar starts transparent.
  const solid = scrolled || menuOpen;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        solid ? 'bg-linen/90 shadow-[0_1px_0_rgb(0_0_0/0.06)] backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <div className="container flex h-[76px] items-center justify-between gap-6">
        <Link href={routes.home()} aria-label={`${site.name} home`} className="relative z-10">
          <Logo name={site.name} logo={site.logo} logoLight={site.logoLight} tone={solid ? 'dark' : 'light'} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <Link
              href={routes.products()}
              aria-expanded={productsOpen}
              onFocus={() => setProductsOpen(true)}
              className={cn(
                'flex items-center gap-1 rounded-full px-4 py-2 text-[14px] font-medium transition-colors',
                solid ? 'text-ink hover:bg-linen-300' : 'text-linen/90 hover:text-linen',
                isActive(routes.products()) && (solid ? 'bg-linen-300' : 'text-linen')
              )}
            >
              Products
              <ChevronDown className={cn('size-3.5 transition-transform', productsOpen && 'rotate-180')} />
            </Link>

            {categories.length > 0 && (
              <div
                className={cn(
                  'absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3 transition-all duration-300',
                  productsOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                )}
              >
                <div className="grid grid-cols-[1fr_220px] overflow-hidden rounded-2xl border border-border bg-white shadow-lift">
                  <ul className="grid grid-cols-2 gap-1 p-3">
                    {categories.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={routes.productCategory(c.slug)}
                          className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-linen"
                        >
                          <span className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                            <CmsImage src={c.image} alt="" fill sizes="48px" className="object-cover" />
                          </span>
                          <span className="text-[14px] font-medium text-ink">{c.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={routes.products()}
                    className="flex flex-col justify-between bg-forest-800 p-5 text-linen transition-colors hover:bg-forest-700"
                  >
                    <span className="font-display text-2xl font-light leading-tight">
                      Browse the full collection
                    </span>
                    <span className="flex items-center gap-1 text-sm text-oak-200">
                      All products <ArrowUpRight className="size-4" />
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-full px-4 py-2 text-[14px] font-medium transition-colors',
                solid ? 'text-ink hover:bg-linen-300' : 'text-linen/90 hover:text-linen',
                isActive(l.href) && (solid ? 'bg-linen-300' : 'text-linen')
              )}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant={solid ? 'default' : 'light'} className="hidden sm:inline-flex">
            <Link href={routes.contactUs()}>Get a quote</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={cn(
              'relative z-10 grid size-11 place-items-center rounded-full transition-colors lg:hidden',
              solid ? 'text-ink hover:bg-linen-300' : 'text-linen hover:bg-white/10'
            )}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 top-[76px] overflow-y-auto bg-linen transition-all duration-500 lg:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <nav className="container flex flex-col gap-1 py-8" aria-label="Mobile">
          <Link href={routes.products()} className="border-b border-border py-4 font-display text-3xl font-light">
            Products
          </Link>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-4">
            {categories.map((c) => (
              <Link key={c.id} href={routes.productCategory(c.slug)} className="py-1 text-stone-600">
                {c.name}
              </Link>
            ))}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="border-b border-border py-4 font-display text-3xl font-light">
              {l.name}
            </Link>
          ))}
          <Button asChild size="lg" className="mt-8">
            <Link href={routes.contactUs()}>Get a free quote</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  ExternalLink,
  FileText,
  FolderTree,
  Home,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  PanelsTopLeft,
  Scale,
  Settings,
  Sparkles,
  UserCog,
  X,
} from 'lucide-react';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useAdminAuth } from './auth-provider';
import { useAdminQuery } from '@/lib/admin/hooks';

type NavItem = { label: string; href: string; icon: React.ElementType; badge?: number };

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const { data: dash } = useAdminQuery<{ counts: { unreadInquiries: number } }>('/admin/dashboard');
  const unread = dash?.counts.unreadInquiries ?? 0;

  useEffect(() => setOpen(false), [pathname]);

  const groups: { title?: string; items: NavItem[] }[] = [
    {
      items: [
        { label: 'Dashboard', href: routes.admin.home(), icon: LayoutDashboard },
        { label: 'Analytics', href: routes.admin.analytics(), icon: BarChart3 },
        { label: 'Activity log', href: routes.admin.logs(), icon: Activity },
      ],
    },
    {
      title: 'Catalog',
      items: [
        { label: 'Products', href: routes.admin.products(), icon: Package },
        { label: 'Categories', href: routes.admin.categories(), icon: FolderTree },
        { label: 'Design cases', href: routes.admin.designCases(), icon: Sparkles },
        { label: 'Media library', href: routes.admin.media(), icon: Images },
      ],
    },
    {
      title: 'Pages',
      items: [
        { label: 'Home page', href: routes.admin.pages('home'), icon: Home },
        { label: 'About page', href: routes.admin.pages('about'), icon: FileText },
        { label: 'Page headers', href: routes.admin.pages('headers'), icon: PanelsTopLeft },
        { label: 'Legal pages', href: routes.admin.pages('legal'), icon: Scale },
      ],
    },
    {
      title: 'Engagement',
      items: [
        { label: 'Inbox', href: routes.admin.inbox(), icon: Inbox, badge: unread },
        { label: 'Subscribers', href: routes.admin.subscribers(), icon: Mail },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Site settings', href: routes.admin.settings(), icon: Settings },
        { label: 'Admin users', href: routes.admin.users(), icon: UserCog },
      ],
    },
  ];

  const isActive = (href: string) =>
    href === routes.admin.home() ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href={routes.admin.home()} className="font-display text-2xl text-linen">
          Oaken<span className="text-oak-400">.</span>
          <span className="ml-2 align-middle font-sans text-[10px] font-semibold uppercase tracking-eyebrow text-linen/40">
            CMS
          </span>
        </Link>
        <button className="text-linen/60 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {groups.map((g, gi) => (
          <div key={gi} className="mt-5 first:mt-2">
            {g.title && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-eyebrow text-linen/35">{g.title}</p>
            )}
            {g.items.map(({ label, href, icon: I, badge }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-colors',
                  isActive(href) ? 'bg-white/10 text-linen' : 'text-linen/60 hover:bg-white/5 hover:text-linen'
                )}
              >
                <I className="size-4" strokeWidth={1.75} />
                <span className="flex-1">{label}</span>
                {!!badge && (
                  <span className="rounded-full bg-oak-500 px-2 py-0.5 text-[11px] font-semibold text-white">{badge}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="grid size-8 place-items-center rounded-full bg-oak-500 text-sm font-semibold uppercase text-white">
            {user.email[0]}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-linen/70">{user.email}</span>
          <button onClick={logout} className="text-linen/50 hover:text-linen" aria-label="Log out" title="Log out">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-forest-900 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-forest-900">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-stone-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="flex-1" />
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:border-stone-400 hover:text-ink"
          >
            View site <ExternalLink className="size-3.5" />
          </Link>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-normal text-ink">{title}</h1>
        {description && <p className="mt-1 text-stone-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

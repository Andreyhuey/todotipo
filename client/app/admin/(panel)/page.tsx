'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Eye, Images, Inbox, Mail, Package, Plus, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { useAdminQuery } from '@/lib/admin/hooks';
import { routes } from '@/lib/routes';
import type { ActivityLog, Inquiry } from '@/types/cms';
import { ActivityFeed } from '@/components/admin/activity';

interface Dashboard {
  counts: {
    products: number;
    designCases: number;
    media: number;
    subscribers: number;
    unreadInquiries: number;
    visitorsToday: number;
    pageViewsToday: number;
  };
  recentInquiries: Inquiry[];
  recentActivity: ActivityLog[];
}

export default function AdminDashboard() {
  const { data } = useAdminQuery<Dashboard>('/admin/dashboard');
  const c = data?.counts;

  const stats = [
    { label: 'Visitors (24h)', value: c?.visitorsToday, href: routes.admin.analytics(), icon: BarChart3 },
    { label: 'Page views (24h)', value: c?.pageViewsToday, href: routes.admin.analytics(), icon: Eye },
    { label: 'Products', value: c?.products, href: routes.admin.products(), icon: Package },
    { label: 'Design cases', value: c?.designCases, href: routes.admin.designCases(), icon: Sparkles },
    { label: 'Media files', value: c?.media, href: routes.admin.media(), icon: Images },
    { label: 'Unread messages', value: c?.unreadInquiries, href: routes.admin.inbox(), icon: Inbox },
    { label: 'Subscribers', value: c?.subscribers, href: routes.admin.subscribers(), icon: Mail },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Everything on the public site is managed from here."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={routes.admin.designCase('new')}>
                <Plus /> Design case
              </Link>
            </Button>
            <Button asChild>
              <Link href={routes.admin.product('new')}>
                <Plus /> Product
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        {stats.map(({ label, value, href, icon: I }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-soft"
          >
            <I className="size-5 text-oak-500" strokeWidth={1.75} />
            <span className="font-display text-3xl">{value ?? '—'}</span>
            <span className="text-sm text-stone-500">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-stone-200 bg-white">
          <header className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
            <h2 className="font-medium">Latest enquiries</h2>
            <Link href={routes.admin.inbox()} className="flex items-center gap-1 text-sm text-oak-700 hover:underline">
              Open inbox <ArrowRight className="size-3.5" />
            </Link>
          </header>
          {data?.recentInquiries.length ? (
            <ul className="divide-y divide-stone-100">
              {data.recentInquiries.map((q) => (
                <li key={q.id}>
                  <Link href={`${routes.admin.inbox()}?id=${q.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50">
                    <span className={`size-2 shrink-0 rounded-full ${q.isRead ? 'bg-transparent' : 'bg-oak-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">{q.name}</p>
                      <p className="truncate text-sm text-stone-500">{q.subject}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">{q.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-10 text-center text-sm text-stone-500">No enquiries yet.</p>
          )}
        </section>

        <section className="flex flex-col gap-3 rounded-2xl bg-forest-800 p-6 text-linen">
          <h2 className="font-display text-xl text-linen">Quick edits</h2>
          {[
            { label: 'Visitor analytics', href: routes.admin.analytics() },
            { label: 'Home page hero & sections', href: routes.admin.pages('home') },
            { label: 'Logo, contact details & socials', href: routes.admin.settings() },
            { label: 'About page', href: routes.admin.pages('about') },
            { label: 'Page header images', href: routes.admin.pages('headers') },
            { label: 'Upload images', href: routes.admin.media() },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
            >
              {l.label} <ArrowRight className="size-4 text-oak-300" />
            </Link>
          ))}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white">
        <header className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 className="font-medium">Recent activity</h2>
          <Link href={routes.admin.logs()} className="flex items-center gap-1 text-sm text-oak-700 hover:underline">
            Full activity log <ArrowRight className="size-3.5" />
          </Link>
        </header>
        <ActivityFeed items={data?.recentActivity ?? []} />
      </section>
    </>
  );
}

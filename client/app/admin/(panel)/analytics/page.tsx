'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Laptop, MapPin, Monitor, RefreshCw, Search, Smartphone, Tablet, X } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import { BarList, Flag, KpiCard, TrafficChart, formatDuration } from '@/components/admin/analytics-charts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminQuery } from '@/lib/admin/hooks';
import { cn } from '@/lib/utils';
import type { AnalyticsSummary, Pagination, Visit, VisitorSummary } from '@/types/cms';

const RANGES = [
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
];

const nf = new Intl.NumberFormat();
const timeFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const deviceIcon = (d: string) => (d === 'mobile' ? Smartphone : d === 'tablet' ? Tablet : Monitor);

const place = (v: Pick<Visit, 'city' | 'region' | 'country'>) =>
  [v.city, v.region !== v.city ? v.region : '', v.country].filter(Boolean).join(', ') || 'Unknown location';

export default function AnalyticsPage() {
  const [range, setRange] = useState('7d');
  const [country, setCountry] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const tz = useMemo(() => new Date().getTimezoneOffset(), []);

  const summaryQ = useAdminQuery<AnalyticsSummary>(`/admin/analytics?range=${range}&tz=${tz}`);
  const s = summaryQ.data;

  const params = new URLSearchParams({ range, page: String(page) });
  if (country) params.set('country', country);
  if (q) params.set('q', q);
  const visitsQ = useAdminQuery<{ data: VisitorSummary[]; pagination: Pagination }>(`/admin/analytics/visitors?${params}`, {
    full: true,
  });

  const refresh = () => {
    summaryQ.refetch();
    visitsQ.refetch();
  };

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Every visit to the public site, with location from the visitor's IP address."
        actions={
          <Button variant="outline" onClick={refresh} loading={summaryQ.isFetching}>
            {!summaryQ.isFetching && <RefreshCw />} Refresh
          </Button>
        }
      />

      {/* Filters: one row above everything they scope */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-stone-200 bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => {
                setRange(r.key);
                setPage(1);
              }}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                range === r.key ? 'bg-ink text-white' : 'text-stone-600 hover:text-ink'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        {country && (
          <button
            type="button"
            onClick={() => setCountry('')}
            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm"
          >
            <Flag code={country} /> {s?.countries.find((c) => c.name === country)?.label ?? country}
            <X className="size-3.5 text-stone-400" />
          </button>
        )}
        {s && (
          <span className="ml-auto flex items-center gap-2 rounded-full bg-forest-50 px-3 py-1.5 text-sm text-forest-700">
            <span className="relative flex size-2">
              {s.live > 0 && <span className="absolute inline-flex size-full animate-ping rounded-full bg-forest-500 opacity-60" />}
              <span className="relative inline-flex size-2 rounded-full bg-forest-500" />
            </span>
            {s.live} {s.live === 1 ? 'visitor' : 'visitors'} online now
          </span>
        )}
      </div>

      <div className={cn('flex flex-col gap-6 transition-opacity', summaryQ.isFetching && s && 'opacity-60')}>
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <KpiCard label="Visitors" value={nf.format(s?.totals.visitors ?? 0)} current={s?.totals.visitors ?? 0} previous={s?.previous.visitors ?? 0} />
          <KpiCard label="Page views" value={nf.format(s?.totals.pageViews ?? 0)} current={s?.totals.pageViews ?? 0} previous={s?.previous.pageViews ?? 0} />
          <KpiCard label="Sessions" value={nf.format(s?.totals.sessions ?? 0)} current={s?.totals.sessions ?? 0} previous={s?.previous.sessions ?? 0} />
          <KpiCard
            label="Avg. time on page"
            value={formatDuration(s?.totals.avgDuration ?? 0)}
            current={s?.totals.avgDuration ?? 0}
            previous={s?.previous.avgDuration ?? 0}
          />
          <KpiCard
            label="Bounce rate"
            value={`${s?.totals.bounceRate ?? 0}%`}
            current={s?.totals.bounceRate ?? 0}
            previous={s?.previous.bounceRate ?? 0}
            invert
          />
        </div>

        <Panel title="Page views">
          {s ? <TrafficChart series={s.series} granularity={s.granularity} /> : <div className="h-[260px]" />}
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Top pages" subtitle="Page views">
            <BarList items={s?.pages ?? []} render={(i) => <span className="truncate font-mono text-[13px]">{i.name}</span>} />
          </Panel>
          <Panel title="Countries" subtitle="Visitors · click to filter visits">
            <BarList
              items={s?.countries ?? []}
              onSelect={(i) => {
                setCountry(i.name);
                setPage(1);
              }}
              render={(i) => (
                <>
                  <Flag code={i.name} /> <span className="truncate">{i.label}</span>
                </>
              )}
            />
            {!!s?.unlocated && (
              <p className="mt-3 text-xs text-stone-400">{s.unlocated} page views without a location yet (local or private network).</p>
            )}
          </Panel>
          <Panel title="Cities" subtitle="Visitors">
            <BarList
              items={s?.cities ?? []}
              render={(i) => {
                const [city, cc] = i.name.split('|');
                return (
                  <>
                    <Flag code={cc} /> <span className="truncate">{city}</span>
                  </>
                );
              }}
            />
          </Panel>
          <Panel title="Referrers" subtitle="Where visitors came from">
            <BarList items={s?.referrers ?? []} />
          </Panel>
          <Panel title="Devices" subtitle="Visitors">
            <BarList
              items={s?.devices ?? []}
              render={(i) => {
                const I = deviceIcon(i.name);
                return (
                  <>
                    <I className="size-4 text-stone-500" /> <span className="capitalize">{i.name}</span>
                  </>
                );
              }}
            />
          </Panel>
          <div className="grid gap-6 sm:grid-cols-2">
            <Panel title="Browsers">
              <BarList items={s?.browsers ?? []} />
            </Panel>
            <Panel title="Operating systems">
              <BarList items={s?.os ?? []} />
            </Panel>
          </div>
        </div>

        {/* Visit log */}
        <Panel
          title="Visit log"
          subtitle={
            visitsQ.data
              ? `${nf.format(visitsQ.data.pagination.total)} ${visitsQ.data.pagination.total === 1 ? 'visitor' : 'visitors'} · click one to see their pages`
              : undefined
          }
          action={
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search page, city, country or IP"
                className="h-9 pl-9 text-sm"
              />
            </div>
          }
          flush
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-y border-stone-100 bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Last seen</th>
                  <th className="px-3 py-3 font-medium">Location</th>
                  <th className="px-3 py-3 font-medium">Pages</th>
                  <th className="px-3 py-3 font-medium">Landing page</th>
                  <th className="px-3 py-3 font-medium">Source</th>
                  <th className="px-3 py-3 font-medium">Device</th>
                  <th className="px-5 py-3 text-right font-medium">Time on site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {visitsQ.data?.data.map((v) => {
                  const I = deviceIcon(v.device);
                  return (
                    <tr
                      key={v.visitorId}
                      tabIndex={0}
                      onClick={() => setOpenId(v.visitorId)}
                      onKeyDown={(e) => e.key === 'Enter' && setOpenId(v.visitorId)}
                      className="cursor-pointer hover:bg-stone-50 focus:bg-oak-50 focus:outline-none"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-stone-500">{timeFmt.format(new Date(v.lastSeen))}</td>
                      <td className="max-w-[280px] px-3 py-3">
                        <span className="flex items-center gap-2">
                          <Flag code={v.countryCode} />
                          <span className={cn('truncate', !v.countryCode && 'text-stone-400')}>{place(v)}</span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 tabular-nums text-ink">
                        {v.pages} {v.pages === 1 ? 'page' : 'pages'}
                        {v.views > v.pages && <span className="text-stone-400"> · {v.views} views</span>}
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-3 font-mono text-[13px]">{v.landingPage}</td>
                      <td className="px-3 py-3 text-stone-600">{v.referrerHost || 'Direct'}</td>
                      <td className="px-3 py-3 text-stone-600">
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <I className="size-4 text-stone-400" /> {v.browser} · {v.os}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-stone-600">
                        {v.duration > 0 ? formatDuration(v.duration) : '—'}
                      </td>
                    </tr>
                  );
                })}
                {visitsQ.data && !visitsQ.data.data.length && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-stone-500">
                      No visitors in this period yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {visitsQ.data && visitsQ.data.pagination.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-stone-100 px-5 py-3 text-sm">
              <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Newer
              </Button>
              <span className="text-stone-500">
                Page {page} of {visitsQ.data.pagination.last_page}
              </span>
              <Button size="sm" variant="ghost" disabled={page >= visitsQ.data.pagination.last_page} onClick={() => setPage(page + 1)}>
                Older
              </Button>
            </div>
          )}
        </Panel>
      </div>

      {openId !== null && <VisitorDetail visitorId={openId} range={range} onClose={() => setOpenId(null)} />}
    </>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
  flush,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3 pt-4">
        <div>
          <h2 className="font-medium text-ink">{title}</h2>
          {subtitle && <p className="text-xs text-stone-500">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className={flush ? '' : 'px-3 pb-4'}>{children}</div>
    </section>
  );
}

// ---- visit detail ---------------------------------------------------------------

/** Subset of the ipgeolocation.io v3 response shown in the detail panel. */
interface GeoData {
  location?: { zipcode?: string; continent_name?: string };
  time_zone?: { current_tz_abbreviation?: string };
  asn?: { as_number?: string };
  currency?: { code?: string; name?: string };
  country_metadata?: { calling_code?: string };
}

type PageView = Pick<Visit, 'id' | 'sessionId' | 'path' | 'title' | 'referrerHost' | 'createdAt' | 'duration'>;

interface VisitorDetailData {
  /** The visitor's latest located page view — source of the details below. */
  visit: Visit;
  geo: GeoData | null;
  /** Every page view in the selected range, oldest first. */
  pages: PageView[];
  visitorTotal: number;
}

const dayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

function VisitorDetail({ visitorId, range, onClose }: { visitorId: string; range: string; onClose: () => void }) {
  const { data } = useAdminQuery<VisitorDetailData>(`/admin/analytics/visitors/${visitorId}?range=${range}`);
  const v = data?.visit;
  const g = data?.geo;
  const hasCoords = v?.latitude !== null && v?.latitude !== undefined && v?.longitude !== null;
  const pages = useMemo(() => data?.pages ?? [], [data]);
  const totalTime = pages.reduce((sum, p) => sum + (p.duration ?? 0), 0);
  const uniquePages = new Set(pages.map((p) => p.path)).size;

  // Page views grouped by local day, in the order they happened.
  const days = useMemo(() => {
    const groups = new Map<string, PageView[]>();
    for (const p of pages) {
      const key = dayFmt.format(new Date(p.createdAt));
      groups.set(key, [...(groups.get(key) ?? []), p]);
    }
    return [...groups.entries()];
  }, [pages]);

  const rows: [string, React.ReactNode][] = v
    ? [
        ['IP address', <span key="ip" className="font-mono">{v.ip}</span>],
        ['Location', place(v)],
        ['Postcode', g?.location?.zipcode],
        ['Coordinates', hasCoords ? `${v.latitude}, ${v.longitude}` : null],
        ['Continent', g?.location?.continent_name],
        ['Timezone', v.timezone && `${v.timezone}${g?.time_zone?.current_tz_abbreviation ? ` (${g.time_zone.current_tz_abbreviation})` : ''}`],
        ['Network', v.isp && `${v.isp}${g?.asn?.as_number ? ` · ${g.asn.as_number}` : ''}`],
        ['Currency', g?.currency?.code && `${g.currency.name} (${g.currency.code})`],
        ['Calling code', g?.country_metadata?.calling_code],
        ['Browser', `${v.browser} on ${v.os}`],
        ['Device', <span key="d" className="capitalize">{v.device}{v.screen ? ` · ${v.screen}` : ''}</span>],
        ['Language', v.language],
        ['Referrer', v.referrer ? <a key="r" href={v.referrer} target="_blank" rel="noreferrer" className="break-all text-oak-700 hover:underline">{v.referrer}</a> : 'Direct'],
        ['User agent', <span key="ua" className="break-all text-xs text-stone-500">{v.userAgent}</span>],
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-lg animate-sheet-in flex-col overflow-y-auto bg-white shadow-lift">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-stone-100 bg-white px-6 py-4">
          <div className="min-w-0">
            <p className="text-xs text-stone-500">
              {pages.length ? `Last seen ${timeFmt.format(new Date(pages[pages.length - 1].createdAt))}` : 'Loading…'}
            </p>
            <h2 className="truncate text-sm text-ink">
              {pages.length > 0 &&
                `${uniquePages} ${uniquePages === 1 ? 'page' : 'pages'}${pages.length > uniquePages ? ` · ${pages.length} views` : ''}${
                  totalTime ? ` · ${formatDuration(totalTime)} on site` : ''
                }`}
            </h2>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </header>

        {v && (
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-3">
              <Flag code={v.countryCode} className="h-6 w-9" />
              <div>
                <p className="font-display text-xl text-ink">{place(v)}</p>
                <p className="text-sm text-stone-500">
                  {data!.visitorTotal > pages.length
                    ? `Returning visitor · ${data!.visitorTotal} page views in total`
                    : 'New visitor in this period'}
                </p>
              </div>
            </div>

            {hasCoords && (
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <iframe
                  title="Approximate location"
                  className="h-48 w-full"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${v.longitude! - 0.25}%2C${v.latitude! - 0.15}%2C${v.longitude! + 0.25}%2C${v.latitude! + 0.15}&layer=mapnik&marker=${v.latitude}%2C${v.longitude}`}
                />
                <a
                  href={`https://www.openstreetmap.org/?mlat=${v.latitude}&mlon=${v.longitude}#map=11/${v.latitude}/${v.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-4 py-2 text-xs text-stone-500 hover:text-ink"
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> Approximate — IP locations are usually accurate to the city
                  </span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}

            <dl className="divide-y divide-stone-100 rounded-xl border border-stone-200">
              {rows
                .filter(([, val]) => val)
                .map(([label, val]) => (
                  <div key={label} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-2.5 text-sm">
                    <dt className="text-stone-500">{label}</dt>
                    <dd className="min-w-0 text-ink">{val}</dd>
                  </div>
                ))}
            </dl>

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
                <Laptop className="size-4 text-stone-400" /> Pages visited
              </h3>
              <div className="flex flex-col gap-5">
                {days.map(([day, views]) => (
                  <div key={day}>
                    {days.length > 1 && <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-400">{day}</p>}
                    <ol className="relative flex flex-col gap-3 border-l border-stone-200 pl-5">
                      {views.map((p, i) => (
                        <li key={p.id} className="relative">
                          <span
                            className={cn(
                              'absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 border-white',
                              i === 0 ? 'bg-oak-500' : 'bg-stone-300'
                            )}
                          />
                          <p className="break-all font-mono text-[13px] text-ink">{p.path}</p>
                          {p.title && <p className="truncate text-xs text-stone-500">{p.title}</p>}
                          <p className="text-xs text-stone-400">
                            {new Date(p.createdAt).toLocaleTimeString()}
                            {p.duration !== null && ` · ${formatDuration(p.duration)}`}
                            {p.referrerHost && ` · from ${p.referrerHost}`}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

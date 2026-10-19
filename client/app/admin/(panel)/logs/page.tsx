'use client';

import { useState } from 'react';
import { Download, Pause, Play, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/admin/shell';
import { CATEGORY_META, LEVEL_META, LevelBadge, actorLabel, timeAgo } from '@/components/admin/activity';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminQuery } from '@/lib/admin/hooks';
import { tokenStore } from '@/lib/admin/api';
import { apiUrl } from '@/constants/config';
import { cn } from '@/lib/utils';
import type { ActivityLog, LogCategory, LogLevel, Pagination } from '@/types/cms';

interface LogsResponse {
  data: ActivityLog[];
  facets: { categories: { name: LogCategory; count: number }[]; levels: { name: LogLevel; count: number }[] };
  pagination: Pagination;
}

const RANGES = [
  { key: '24h', label: '24 hours' },
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
  { key: 'all', label: 'All' },
];

const timeFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' });

export default function LogsPage() {
  const [range, setRange] = useState('7d');
  const [category, setCategory] = useState<LogCategory | ''>('');
  const [level, setLevel] = useState<LogLevel | ''>('');
  const [actor, setActor] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [live, setLive] = useState(true);
  const [open, setOpen] = useState<ActivityLog | null>(null);

  const params = new URLSearchParams({ range, page: String(page) });
  if (category) params.set('category', category);
  if (level) params.set('level', level);
  if (actor) params.set('actor', actor);
  if (q) params.set('q', q);

  // Live mode refreshes the first page every 10 seconds.
  const { data, isFetching } = useAdminQuery<LogsResponse>(`/admin/logs?${params}`, {
    full: true,
    keepPrevious: true,
    refetchInterval: live && page === 1 ? 10_000 : false,
  });

  const reset = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };
  const count = (c: LogCategory) => data?.facets.categories.find((f) => f.name === c)?.count ?? 0;
  const total = data?.facets.categories.reduce((a, b) => a + b.count, 0) ?? 0;

  const exportCsv = async () => {
    const res = await fetch(`${apiUrl('/admin/logs/export')}?${params}`, {
      headers: { Authorization: `Bearer ${tokenStore.get()}` },
    });
    if (!res.ok) return toast.error('Export failed');
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Activity log"
        description="Everything happening on the platform — content changes, uploads, sign-ins, visitor enquiries and system events."
        actions={
          <>
            <Button variant="outline" onClick={() => setLive((l) => !l)} title={live ? 'Pause live updates' : 'Resume live updates'}>
              {live ? <Pause /> : <Play />} {live ? 'Live' : 'Paused'}
            </Button>
            <Button variant="outline" onClick={exportCsv}>
              <Download /> Export CSV
            </Button>
          </>
        }
      />

      {/* Filters: one row above the content they scope */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-stone-200 bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => reset(setRange)(r.key)}
              className={cn('rounded-full px-3.5 py-1.5 text-sm', range === r.key ? 'bg-ink text-white' : 'text-stone-600 hover:text-ink')}
            >
              {r.label}
            </button>
          ))}
        </div>
        <select
          value={level}
          onChange={(e) => reset(setLevel)(e.target.value as LogLevel | '')}
          className="h-10 rounded-full border border-stone-200 bg-white px-4 text-sm"
          aria-label="Level"
        >
          <option value="">All levels</option>
          {(['info', 'warning', 'error'] as LogLevel[]).map((l) => (
            <option key={l} value={l}>
              {LEVEL_META[l].label} ({data?.facets.levels.find((f) => f.name === l)?.count ?? 0})
            </option>
          ))}
        </select>
        <select
          value={actor}
          onChange={(e) => reset(setActor)(e.target.value)}
          className="h-10 rounded-full border border-stone-200 bg-white px-4 text-sm"
          aria-label="Who"
        >
          <option value="">Everyone</option>
          <option value="admin">Admins</option>
          <option value="visitor">Visitors</option>
          <option value="system">System</option>
        </select>
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={q}
            onChange={(e) => reset(setQ)(e.target.value)}
            placeholder="Search messages, people, items or IPs"
            className="h-10 rounded-full pl-10 text-sm"
          />
        </div>
      </div>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        <CategoryChip active={!category} onClick={() => reset(setCategory)('')} label="All activity" count={total} />
        {(Object.keys(CATEGORY_META) as LogCategory[]).map((c) => {
          const { label, icon } = CATEGORY_META[c];
          return <CategoryChip key={c} active={category === c} onClick={() => reset(setCategory)(c)} label={label} icon={icon} count={count(c)} />;
        })}
      </div>

      <section className={cn('overflow-hidden rounded-2xl border border-stone-200 bg-white transition-opacity', isFetching && !live && 'opacity-60')}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-stone-100 bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-5 py-3 font-medium">When</th>
                <th className="px-3 py-3 font-medium">Level</th>
                <th className="px-3 py-3 font-medium">Activity</th>
                <th className="px-3 py-3 font-medium">Who</th>
                <th className="px-5 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data?.data.map((log) => {
                const { icon: I, label } = CATEGORY_META[log.category] ?? CATEGORY_META.system;
                return (
                  <tr
                    key={log.id}
                    tabIndex={0}
                    onClick={() => setOpen(log)}
                    onKeyDown={(e) => e.key === 'Enter' && setOpen(log)}
                    className="cursor-pointer align-top hover:bg-stone-50 focus:bg-oak-50 focus:outline-none"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-stone-500" title={timeFmt.format(new Date(log.createdAt))}>
                      {timeAgo(log.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <LevelBadge level={log.level} />
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-start gap-2.5">
                        <I className="mt-0.5 size-4 shrink-0 text-stone-400" aria-label={label} />
                        <span className="text-ink">{log.message}</span>
                      </span>
                    </td>
                    <td className="max-w-[220px] truncate px-3 py-3 text-stone-600">
                      <span className="text-xs uppercase tracking-wider text-stone-400">{log.actorType}</span>{' '}
                      {log.actorType !== 'system' && actorLabel(log)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-stone-500">{log.ip || '—'}</td>
                  </tr>
                );
              })}
              {data && !data.data.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-stone-500">
                    No activity matches these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data && data.pagination.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-stone-100 px-5 py-3 text-sm">
            <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Newer
            </Button>
            <span className="text-stone-500">
              Page {page} of {data.pagination.last_page} · {data.pagination.total.toLocaleString()} entries
            </span>
            <Button size="sm" variant="ghost" disabled={page >= data.pagination.last_page} onClick={() => setPage(page + 1)}>
              Older
            </Button>
          </div>
        )}
      </section>
      <p className="mt-3 text-xs text-stone-400">Entries are kept for 180 days.</p>

      {open && <LogDetail log={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
  icon: I,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: React.ElementType;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
        active ? 'border-ink bg-ink text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
      )}
    >
      {I && <I className="size-3.5" />}
      {label}
      <span className={cn('tabular-nums text-xs', active ? 'text-white/70' : 'text-stone-400')}>{count}</span>
    </button>
  );
}

const META_LABELS: Record<string, string> = {
  changed: 'Fields changed',
  files: 'Files',
  folder: 'Folder',
  error: 'Error',
  reason: 'Reason',
  status: 'HTTP status',
  method: 'Method',
  path: 'Endpoint',
  isRead: 'Marked read',
  forced: 'Forced delete',
  subject: 'Subject',
  template: 'Email template',
  products: 'Products',
  designCases: 'Design cases',
  node: 'Node version',
  env: 'Environment',
  response: 'Provider response',
  file: 'File',
  stack: 'Stack trace',
};

function LogDetail({ log, onClose }: { log: ActivityLog; onClose: () => void }) {
  const { label: catLabel, icon: I } = CATEGORY_META[log.category] ?? CATEGORY_META.system;
  const fmt = (v: unknown) => (Array.isArray(v) ? (v.length ? v.join(', ') : '—') : typeof v === 'object' && v ? JSON.stringify(v) : String(v));

  const rows: [string, React.ReactNode][] = [
    ['When', timeFmt.format(new Date(log.createdAt))],
    ['Level', <LevelBadge key="l" level={log.level} />],
    ['Category', <span key="c" className="flex items-center gap-2"><I className="size-4 text-stone-400" />{catLabel}</span>],
    ['Event', <code key="a" className="text-xs">{log.action}</code>],
    ['Who', log.actorType === 'system' ? 'System' : `${actorLabel(log)} (${log.actorType})`],
    ['Item', log.targetLabel && `${log.targetLabel}${log.targetType ? ` · ${log.targetType.replace('_', ' ')}` : ''}`],
    ['IP address', log.ip && <span key="ip" className="font-mono">{log.ip}</span>],
    ['Device', log.userAgent && <span key="ua" className="break-all text-xs text-stone-500">{log.userAgent}</span>],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-lg animate-sheet-in flex-col overflow-y-auto bg-white shadow-lift">
        <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-stone-100 bg-white px-6 py-4">
          <h2 className="font-medium text-ink">{log.message}</h2>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </header>
        <div className="flex flex-col gap-6 p-6">
          <dl className="divide-y divide-stone-100 rounded-xl border border-stone-200">
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-2.5 text-sm">
                  <dt className="text-stone-500">{k}</dt>
                  <dd className="min-w-0 text-ink">{v}</dd>
                </div>
              ))}
          </dl>
          {Object.keys(log.meta ?? {}).length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-ink">Details</h3>
              <dl className="divide-y divide-stone-100 rounded-xl border border-stone-200">
                {Object.entries(log.meta).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-2.5 text-sm">
                    <dt className="text-stone-500">{META_LABELS[k] ?? k}</dt>
                    <dd className={cn('min-w-0 break-words text-ink', k === 'stack' && 'whitespace-pre-wrap font-mono text-xs')}>{fmt(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

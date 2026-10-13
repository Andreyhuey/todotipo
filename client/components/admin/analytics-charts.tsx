'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CountItem } from '@/types/cms';

/** Chart ink, validated for contrast and chroma on the admin's white surface. */
export const CHART_COLOR = '#2F7A4A';

const nf = new Intl.NumberFormat();

export const formatDuration = (s: number) => {
  if (!s) return '0s';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m ? `${m}m ${sec.toString().padStart(2, '0')}s` : `${sec}s`;
};

/** Country flag image (Windows doesn't render flag emoji). */
export function Flag({ code, className }: { code: string; className?: string }) {
  if (!code) return <span className={cn('inline-block h-3.5 w-5 rounded-sm bg-stone-200', className)} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://ipgeolocation.io/static/flags/${code.toLowerCase()}_64.png`}
      alt=""
      loading="lazy"
      className={cn('inline-block h-3.5 w-5 rounded-sm object-cover shadow-[0_0_0_1px_rgb(0_0_0/0.08)]', className)}
    />
  );
}

/**
 * Page views over time — a single series, so one hue and no legend; each bar
 * is its own hover/focus target with a tooltip.
 */
export function TrafficChart({
  series,
  granularity,
}: {
  series: { t: string; views: number; visitors: number }[];
  granularity: 'hour' | 'day';
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 1000;
  const H = 260;
  const pad = { top: 16, right: 8, bottom: 28, left: 40 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const max = Math.max(1, ...series.map((s) => s.views));
  // "Nice" axis max and 4 gridlines
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const niceMax = Math.ceil(max / magnitude) * magnitude;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f));

  const slot = innerW / Math.max(series.length, 1);
  const barW = Math.max(Math.min(slot - 2, 36), 2); // 2px surface gap between bars
  const y = (v: number) => pad.top + innerH - (v / niceMax) * innerH;

  const label = (t: string, long = false) => {
    const d = new Date(granularity === 'hour' ? `${t}:00:00` : `${t}T00:00:00`);
    return granularity === 'hour'
      ? d.toLocaleTimeString(undefined, { hour: 'numeric', ...(long ? { weekday: 'short' } : {}) })
      : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', ...(long ? { weekday: 'short' } : {}) });
  };
  const every = Math.ceil(series.length / 8); // ~8 x-labels max

  const active = hover !== null ? series[hover] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Page views over time">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="#E6E4E0" strokeDasharray={t ? '3 4' : undefined} />
            <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-stone-500 text-[11px]">
              {nf.format(t)}
            </text>
          </g>
        ))}
        {series.map((s, i) => {
          const x = pad.left + i * slot + (slot - barW) / 2;
          const h = y(0) - y(s.views);
          const r = Math.min(4, barW / 2, h);
          return (
            <g
              key={s.t}
              tabIndex={0}
              role="img"
              aria-label={`${label(s.t, true)}: ${s.views} page views, ${s.visitors} visitors`}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="outline-none"
            >
              {/* Hit target spans the whole slot, not just the painted bar */}
              <rect x={pad.left + i * slot} y={pad.top} width={slot} height={innerH} fill="transparent" />
              {s.views > 0 && (
                <path
                  d={`M${x},${y(0)} V${y(0) - h + r} q0,-${r} ${r},-${r} H${x + barW - r} q${r},0 ${r},${r} V${y(0)} Z`}
                  fill={CHART_COLOR}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
              )}
              {i % every === 0 && (
                <text x={pad.left + i * slot + slot / 2} y={H - 8} textAnchor="middle" className="fill-stone-500 text-[11px]">
                  {label(s.t)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm shadow-soft"
          style={{ left: `${((pad.left + hover * slot + slot / 2) / W) * 100}%` }}
        >
          <p className="text-xs text-stone-500">{label(active.t, true)}</p>
          <p className="flex items-center gap-2">
            <span className="h-0.5 w-3 rounded" style={{ background: CHART_COLOR }} />
            <strong className="text-ink">{nf.format(active.views)}</strong>
            <span className="text-stone-500">page views</span>
          </p>
          <p className="pl-5">
            <strong className="text-ink">{nf.format(active.visitors)}</strong>{' '}
            <span className="text-stone-500">visitors</span>
          </p>
        </div>
      )}
    </div>
  );
}

/** Ranked list with proportional bars — value text stays in ink, the bar carries magnitude. */
export function BarList({
  items,
  render,
  empty = 'No data yet',
  onSelect,
}: {
  items: CountItem[];
  render?: (item: CountItem) => React.ReactNode;
  empty?: string;
  onSelect?: (item: CountItem) => void;
}) {
  if (!items.length) return <p className="py-6 text-center text-sm text-stone-400">{empty}</p>;
  const max = Math.max(...items.map((i) => i.count));
  const total = items.reduce((a, b) => a + b.count, 0);

  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => {
        const content = (
          <>
            <span
              className="absolute inset-y-0 left-0 rounded-md opacity-[0.14]"
              style={{ width: `${(item.count / max) * 100}%`, background: CHART_COLOR }}
            />
            <span className="relative flex min-w-0 flex-1 items-center gap-2 truncate">{render ? render(item) : item.label ?? item.name}</span>
            <span className="relative tabular-nums text-ink">{nf.format(item.count)}</span>
            <span className="relative w-10 text-right text-xs tabular-nums text-stone-400">
              {Math.round((item.count / total) * 100)}%
            </span>
          </>
        );
        return (
          <li key={item.name}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="relative flex w-full items-center gap-3 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-stone-50"
              >
                {content}
              </button>
            ) : (
              <div className="relative flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function KpiCard({
  label,
  value,
  current,
  previous,
  invert,
}: {
  label: string;
  value: string;
  current: number;
  previous: number;
  /** For metrics where lower is better (bounce rate). */
  invert?: boolean;
}) {
  const delta = previous ? Math.round(((current - previous) / previous) * 100) : null;
  const good = delta !== null && (invert ? delta < 0 : delta > 0);
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-5">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="font-display text-3xl text-ink">{value}</span>
      <span className="text-xs text-stone-500">
        {delta === null ? (
          'No previous data'
        ) : (
          <>
            <span className={cn('font-medium', delta === 0 ? 'text-stone-500' : good ? 'text-forest-600' : 'text-red-600')}>
              {delta > 0 ? '▲' : delta < 0 ? '▼' : '•'} {Math.abs(delta)}%
            </span>{' '}
            vs previous period
          </>
        )}
      </span>
    </div>
  );
}

'use client';

import {
  AlertOctagon,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Inbox,
  Info,
  KeyRound,
  Server,
  Settings,
  ShieldAlert,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityLog, LogCategory, LogLevel } from '@/types/cms';

export const CATEGORY_META: Record<LogCategory, { label: string; icon: React.ElementType }> = {
  content: { label: 'Content', icon: FileText },
  media: { label: 'Media', icon: ImageIcon },
  settings: { label: 'Settings', icon: Settings },
  inbox: { label: 'Visitors & inbox', icon: Inbox },
  auth: { label: 'Sign-ins', icon: KeyRound },
  security: { label: 'Security', icon: ShieldAlert },
  users: { label: 'Admin users', icon: UserCog },
  system: { label: 'System', icon: Server },
};

// Status colours are reserved for levels and always paired with an icon + label.
export const LEVEL_META: Record<LogLevel, { label: string; icon: React.ElementType; className: string }> = {
  info: { label: 'Info', icon: Info, className: 'bg-stone-100 text-stone-600' },
  warning: { label: 'Warning', icon: AlertTriangle, className: 'bg-amber-50 text-amber-800' },
  error: { label: 'Error', icon: AlertOctagon, className: 'bg-red-50 text-red-700' },
};

export function LevelBadge({ level }: { level: LogLevel }) {
  const { label, icon: I, className } = LEVEL_META[level] ?? LEVEL_META.info;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', className)}>
      <I className="size-3" /> {label}
    </span>
  );
}

export const actorLabel = (log: Pick<ActivityLog, 'actorType' | 'actorEmail'>) =>
  log.actorType === 'admin' ? log.actorEmail || 'Admin' : log.actorType === 'visitor' ? log.actorEmail || 'Visitor' : 'System';

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
export const timeAgo = (iso: string) => {
  const s = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const abs = Math.abs(s);
  if (abs < 60) return rtf.format(s, 'second');
  if (abs < 3600) return rtf.format(Math.round(s / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(s / 3600), 'hour');
  return rtf.format(Math.round(s / 86400), 'day');
};

/** Compact list used on the dashboard. */
export function ActivityFeed({ items, onSelect }: { items: ActivityLog[]; onSelect?: (log: ActivityLog) => void }) {
  if (!items.length) return <p className="px-6 py-10 text-center text-sm text-stone-500">No activity yet.</p>;
  return (
    <ul className="divide-y divide-stone-100">
      {items.map((log) => {
        const { icon: I } = CATEGORY_META[log.category] ?? CATEGORY_META.system;
        const content = (
          <>
            <span
              className={cn(
                'mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg',
                log.level === 'error' ? 'bg-red-50 text-red-600' : log.level === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-stone-100 text-stone-500'
              )}
            >
              <I className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-ink">{log.message}</span>
              <span className="block truncate text-xs text-stone-500">
                {actorLabel(log)} · {timeAgo(log.createdAt)}
              </span>
            </span>
          </>
        );
        return (
          <li key={log.id}>
            {onSelect ? (
              <button type="button" onClick={() => onSelect(log)} className="flex w-full gap-3 px-6 py-3 text-left hover:bg-stone-50">
                {content}
              </button>
            ) : (
              <div className="flex gap-3 px-6 py-3">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

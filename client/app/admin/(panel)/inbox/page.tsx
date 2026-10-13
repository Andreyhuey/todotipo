'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, Mail, MailOpen, Phone, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/admin/api';
import { useAdminMutation, useAdminQuery } from '@/lib/admin/hooks';
import { cn } from '@/lib/utils';
import type { Inquiry, Pagination } from '@/types/cms';

interface InboxResponse {
  data: Inquiry[];
  unread: number;
  pagination: Pagination;
}

const dateFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const META_LABELS: Record<string, string> = {
  product: 'Product',
  quantity: 'Quantity',
  projectType: 'Project type',
  address: 'Address',
  city: 'City',
};

function Inbox() {
  const params = useSearchParams();
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(Number(params.get('id')) || null);

  const qs = new URLSearchParams({ page: String(page) });
  if (type) qs.set('type', type);
  const { data } = useAdminQuery<InboxResponse>(`/admin/inquiries?${qs}`, { full: true });

  const mark = useAdminMutation(({ id, isRead }: { id: number; isRead: boolean }) =>
    adminApi.patch(`/admin/inquiries/${id}`, { isRead })
  );
  const remove = useAdminMutation((id: number) => adminApi.del(`/admin/inquiries/${id}`), { success: 'Deleted' });

  const open = data?.data.find((q) => q.id === openId) ?? null;

  useEffect(() => {
    if (open && !open.isRead) mark.mutate({ id: open.id, isRead: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open?.id]);

  return (
    <>
      <PageHeader
        title="Inbox"
        description={`Contact messages and quote requests${data ? ` — ${data.unread} unread` : ''}. A copy is also emailed to your notification address.`}
      />
      <div className="mb-4 flex gap-2">
        {[
          ['', 'All'],
          ['quote', 'Quote requests'],
          ['contact', 'Messages'],
        ].map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => {
              setType(v);
              setPage(1);
            }}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm',
              type === v ? 'border-ink bg-ink text-white' : 'border-stone-200 bg-white text-stone-600'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <ul className="divide-y divide-stone-100 self-start overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {!data?.data.length && <li className="p-8 text-center text-sm text-stone-500">No messages.</li>}
          {data?.data.map((q) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => setOpenId(q.id)}
                className={cn('flex w-full gap-3 px-4 py-4 text-left hover:bg-stone-50', openId === q.id && 'bg-oak-50')}
              >
                <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', q.isRead ? 'bg-transparent' : 'bg-oak-500')} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn('truncate', !q.isRead && 'font-semibold')}>{q.name}</span>
                    <span className="shrink-0 text-xs text-stone-400">{dateFmt.format(new Date(q.createdAt))}</span>
                  </span>
                  <span className="block truncate text-sm text-stone-600">{q.subject}</span>
                  <span className="block truncate text-sm text-stone-400">{q.message}</span>
                </span>
              </button>
            </li>
          ))}
          {data && data.pagination.last_page > 1 && (
            <li className="flex items-center justify-between p-3 text-sm">
              <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Newer
              </Button>
              <span className="text-stone-500">
                {page} / {data.pagination.last_page}
              </span>
              <Button size="sm" variant="ghost" disabled={page >= data.pagination.last_page} onClick={() => setPage(page + 1)}>
                Older
              </Button>
            </li>
          )}
        </ul>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          {open ? (
            <article className="flex flex-col gap-6">
              <header className="flex flex-col gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs capitalize text-stone-600">{open.type}</span>
                  <h2 className="mt-3 font-display text-2xl">{open.subject}</h2>
                  <p className="mt-1 text-sm text-stone-500">{dateFmt.format(new Date(open.createdAt))}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => mark.mutate({ id: open.id, isRead: !open.isRead })}
                  >
                    {open.isRead ? <Mail /> : <MailOpen />} Mark {open.isRead ? 'unread' : 'read'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => confirm('Delete this message?') && remove.mutate(open.id, { onSuccess: () => setOpenId(null) })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </header>

              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-stone-500">From</dt>
                  <dd className="font-medium">{open.name}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-stone-500">Email</dt>
                  <dd>
                    <a href={`mailto:${open.email}`} className="text-oak-700 hover:underline">
                      {open.email}
                    </a>
                  </dd>
                </div>
                {open.phone && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone-500">Phone</dt>
                    <dd>
                      <a href={`tel:${open.phone}`} className="flex items-center gap-1.5 text-oak-700 hover:underline">
                        <Phone className="size-3.5" /> {open.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {Object.entries(open.meta)
                  .filter(([k, v]) => v && META_LABELS[k])
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase tracking-wider text-stone-500">{META_LABELS[k]}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>

              <div className="whitespace-pre-line rounded-xl bg-stone-50 p-5 leading-relaxed text-stone-700">{open.message}</div>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <a href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject}`)}`}>
                    <Mail /> Reply by email
                  </a>
                </Button>
                {open.meta.link && (
                  <Button asChild variant="outline">
                    <a href={open.meta.link} target="_blank" rel="noreferrer">
                      View product <ExternalLink />
                    </a>
                  </Button>
                )}
              </div>
            </article>
          ) : (
            <p className="py-20 text-center text-stone-500">Select a message to read it.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default function InboxPage() {
  return (
    <Suspense>
      <Inbox />
    </Suspense>
  );
}

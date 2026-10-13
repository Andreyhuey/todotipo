'use client';

import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { adminApi, tokenStore } from '@/lib/admin/api';
import { useAdminMutation, useAdminQuery } from '@/lib/admin/hooks';
import { apiBaseUrl } from '@/constants/config';

interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

export default function SubscribersPage() {
  const { data = [] } = useAdminQuery<Subscriber[]>('/admin/subscribers');
  const remove = useAdminMutation((id: number) => adminApi.del(`/admin/subscribers/${id}`), { success: 'Removed' });

  const exportCsv = async () => {
    const res = await fetch(`${apiBaseUrl()}/api/admin/subscribers?format=csv`, {
      headers: { Authorization: `Bearer ${tokenStore.get()}` },
    });
    if (!res.ok) return toast.error('Export failed');
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Newsletter subscribers"
        description={`${data.length} people signed up through the site footer.`}
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!data.length}>
            <Download /> Export CSV
          </Button>
        }
      />
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Subscribed</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3">{s.email}</td>
                <td className="px-5 py-3 text-stone-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Remove"
                    onClick={() => confirm(`Remove ${s.email}?`) && remove.mutate(s.id)}
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
            {!data.length && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-stone-500">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

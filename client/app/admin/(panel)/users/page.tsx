'use client';

import { useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import { Card, TextField } from '@/components/admin/fields';
import { useAdminAuth } from '@/components/admin/auth-provider';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/admin/api';
import { useAdminMutation, useAdminQuery } from '@/lib/admin/hooks';

interface User {
  id: number;
  email: string;
  username: string | null;
}

export default function UsersPage() {
  const { user: me } = useAdminAuth();
  const { data: users = [] } = useAdminQuery<User[]>('/admin/users');
  const [newUser, setNewUser] = useState({ email: '', password: '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });

  const create = useAdminMutation((body: typeof newUser) => adminApi.post('/admin/users', body), { success: 'Admin added' });
  const remove = useAdminMutation((id: number) => adminApi.del(`/admin/users/${id}`), { success: 'Admin removed' });
  const changePw = useAdminMutation((body: typeof pw) => adminApi.put('/auth/password', body), {
    success: 'Password updated',
    invalidate: false,
  });

  return (
    <>
      <PageHeader title="Admin users" description="People who can sign in to this content manager." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Team">
          <ul className="divide-y divide-stone-100">
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-3 py-3">
                <span className="grid size-9 place-items-center rounded-full bg-oak-100 text-sm font-semibold uppercase text-oak-700">
                  {u.email[0]}
                </span>
                <span className="flex-1 truncate">
                  {u.email} {u.id === me.id && <span className="text-xs text-stone-400">(you)</span>}
                </span>
                {u.id !== me.id && (
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Remove"
                    onClick={() => confirm(`Remove ${u.email}?`) && remove.mutate(u.id)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card title="Add an admin">
            <TextField label="Email" type="email" value={newUser.email} onChange={(email) => setNewUser({ ...newUser, email })} />
            <TextField
              label="Temporary password"
              type="password"
              hint="At least 8 characters. Ask them to change it after signing in."
              value={newUser.password}
              onChange={(password) => setNewUser({ ...newUser, password })}
            />
            <Button
              className="self-start"
              loading={create.isPending}
              onClick={() => create.mutate(newUser, { onSuccess: () => setNewUser({ email: '', password: '' }) })}
            >
              <UserPlus /> Add admin
            </Button>
          </Card>

          <Card title="Change your password">
            <TextField
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={pw.currentPassword}
              onChange={(currentPassword) => setPw({ ...pw, currentPassword })}
            />
            <TextField
              label="New password"
              type="password"
              autoComplete="new-password"
              value={pw.newPassword}
              onChange={(newPassword) => setPw({ ...pw, newPassword })}
            />
            <Button
              className="self-start"
              loading={changePw.isPending}
              onClick={() => changePw.mutate(pw, { onSuccess: () => setPw({ currentPassword: '', newPassword: '' }) })}
            >
              Update password
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}

'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { adminApi, tokenStore } from '@/lib/admin/api';
import { routes } from '@/lib/routes';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.post<{ token: string }>('/auth/login', { email, password });
      tokenStore.set(res.token);
      const next = params.get('next');
      router.replace(next?.startsWith('/admin') && next !== routes.admin.login() ? next : routes.admin.home());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <Button type="submit" size="lg" loading={loading} className="mt-2">
        Sign in
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-forest-900 p-12 lg:flex">
        <p className="font-display text-3xl text-linen">
          Oaken<span className="text-oak-400">.</span>
        </p>
        <div className="max-w-md">
          <p className="font-display text-4xl font-light leading-tight text-linen">
            Manage products, projects and every image on your site — in one place.
          </p>
        </div>
        <p
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-10 select-none font-display text-[16rem] font-light leading-none text-white/[0.04]"
        >
          CMS
        </p>
      </div>
      <div className="flex items-center justify-center bg-linen p-6">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft">
          <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-forest-800 text-linen">
            <Lock className="size-5" />
          </span>
          <h1 className="font-display text-3xl font-normal">Welcome back</h1>
          <p className="mb-8 mt-1 text-stone-500">Sign in to the content manager.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

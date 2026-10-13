'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { adminApi, tokenStore } from '@/lib/admin/api';
import { routes } from '@/lib/routes';
import Loader from '@/components/Loader';

export interface AdminUser {
  id: number;
  email: string;
  username: string | null;
  role: string;
}

interface AuthState {
  user: AdminUser;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export const useAdminAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
};

/** Gates the admin panel: verifies the stored token before rendering. */
export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (!tokenStore.get()) {
      router.replace(`${routes.admin.login()}?next=${encodeURIComponent(pathname)}`);
      return;
    }
    adminApi
      .get<{ user: AdminUser }>('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => {
        tokenStore.clear();
        router.replace(routes.admin.login());
      });
    // Only verify once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    router.replace(routes.admin.login());
  }, [router]);

  if (!user) return <Loader fullPage />;
  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
}

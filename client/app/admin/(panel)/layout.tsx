'use client';

import AdminAuthProvider from '@/components/admin/auth-provider';
import AdminShell from '@/components/admin/shell';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}

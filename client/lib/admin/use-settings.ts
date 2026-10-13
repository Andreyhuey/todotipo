'use client';

import { adminApi } from './api';
import { useAdminMutation, useAdminQuery, useDraft, useUnsavedGuard } from './hooks';
import type { AllSettings } from '@/types/cms';

/** Loads one settings section into an editable draft with a save action. */
export function useSettingsSection<K extends keyof AllSettings>(key: K) {
  const { data, isLoading } = useAdminQuery<AllSettings>('/admin/settings');
  const { draft, update, dirty, reset } = useDraft<AllSettings[K]>(data?.[key]);
  useUnsavedGuard(dirty);

  const mutation = useAdminMutation(
    (value: AllSettings[K]) => adminApi.put<{ data: AllSettings[K] }>(`/admin/settings/${key}`, value),
    { success: 'Saved — the site will update in a moment' }
  );

  const save = () => draft && mutation.mutate(draft, { onSuccess: (res) => reset(res.data) });
  const discard = () => data && reset(data[key]);

  return { draft, update, dirty, isLoading, save, discard, saving: mutation.isPending };
}

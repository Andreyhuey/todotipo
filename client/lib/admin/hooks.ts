'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from './api';

/** GET an admin endpoint; the response's `data` field is returned. */
export function useAdminQuery<T>(
  path: string | null,
  opts: { full?: boolean; refetchInterval?: number | false; keepPrevious?: boolean } = {}
) {
  return useQuery<T, Error, T>({
    queryKey: ['admin', path],
    queryFn: async () => {
      const res = await adminApi.get<{ data: T }>(path!);
      return (opts.full ? res : res.data) as T;
    },
    enabled: !!path,
    staleTime: 10_000,
    refetchInterval: opts.refetchInterval,
    // Opt-in only: editors must never start from a different record's data.
    placeholderData: opts.keepPrevious ? keepPreviousData : undefined,
  });
}

/** Wraps a mutation with toasts and admin cache invalidation. */
export function useAdminMutation<TVars, TRes = unknown>(
  fn: (vars: TVars) => Promise<TRes>,
  opts: { success?: string; invalidate?: boolean } = {}
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      if (opts.success) toast.success(opts.success);
      if (opts.invalidate !== false) qc.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/**
 * Local editable copy of a document. `update` receives a deep clone to mutate,
 * so nested CMS fields can be edited without spread gymnastics.
 */
export function useDraft<T>(source: T | undefined) {
  const [draft, setDraft] = useState<T | undefined>(source);
  const [dirty, setDirty] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (source !== undefined && (!loaded.current || !dirty)) {
      setDraft(structuredClone(source));
      loaded.current = true;
    }
    // Only resync when fresh data arrives and there are no unsaved edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const update = useCallback((fn: (d: T) => void) => {
    setDraft((prev) => {
      if (prev === undefined) return prev;
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setDirty(true);
  }, []);

  const reset = useCallback((value: T) => {
    setDraft(structuredClone(value));
    setDirty(false);
  }, []);

  return { draft, update, dirty, setDirty, reset };
}

/** Warns before closing the tab with unsaved changes. */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
}

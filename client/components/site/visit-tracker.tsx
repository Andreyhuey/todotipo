'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { apiUrl } from '@/constants/config';

const VISITOR_KEY = 'oaken_vid';
const SESSION_KEY = 'oaken_sid';

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

/** Reads (or creates) the visitor id (persistent) and session id (per tab). */
function getIds() {
  try {
    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) localStorage.setItem(VISITOR_KEY, (visitorId = newId()));
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    const isNewSession = !sessionId;
    if (!sessionId) sessionStorage.setItem(SESSION_KEY, (sessionId = newId()));
    return { visitorId, sessionId, isNewSession };
  } catch {
    return null; // storage blocked (private mode etc.) — skip tracking
  }
}

/**
 * Records a page view on every route change and reports time on page when
 * the visitor navigates away. Location is resolved server-side from the IP.
 */
export default function VisitTracker() {
  const pathname = usePathname();
  const firstHit = useRef(true);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === 'true') return;
    const ids = getIds();
    if (!ids) return;

    const started = Date.now();
    let visitId: number | null = null;
    let left = false;

    const sendLeave = () => {
      if (!visitId) return;
      const payload = JSON.stringify({
        id: visitId,
        visitorId: ids.visitorId,
        duration: Math.round((Date.now() - started) / 1000),
      });
      visitId = null;
      // text/plain keeps sendBeacon a "simple" request (no CORS preflight).
      navigator.sendBeacon?.(apiUrl('/track/leave'), new Blob([payload], { type: 'text/plain' }));
    };
    const leave = () => {
      left = true;
      sendLeave();
    };

    // Deferred one tick so React's dev double-mount (mount → unmount → mount)
    // cancels the first run instead of recording a duplicate view.
    const timer = setTimeout(() => {
      // Only the landing page has a meaningful external referrer.
      const referrer = firstHit.current && ids.isNewSession ? document.referrer : '';
      firstHit.current = false;

      fetch(apiUrl('/track'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          visitorId: ids.visitorId,
          sessionId: ids.sessionId,
          path: pathname + window.location.search,
          title: document.title,
          referrer,
          screen: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d?.id) return;
          visitId = d.id;
          // The visitor already moved on before we got an id back.
          if (left) sendLeave();
        })
        .catch(() => {});
    }, 0);

    const onVisibility = () => document.visibilityState === 'hidden' && leave();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', leave);
    return () => {
      clearTimeout(timer);
      leave();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', leave);
    };
  }, [pathname]);

  return null;
}

'use client';

import { baseUrl } from '@/constants/site.data';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Canonical() {
  const pathname = usePathname();
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    setCanonicalUrl(`${baseUrl}${pathname}`);
  }, [pathname]);

  if (!canonicalUrl) return null;

  return <link rel="canonical" href={canonicalUrl} />;
}

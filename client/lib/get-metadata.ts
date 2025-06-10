import { metadataMap } from '@/constants/metadata.data';
import type { Metadata } from 'next';

export function getMetadata(path: string): Metadata {
  return (
    metadataMap[path] ?? {
      title: '',
      description: '',
    }
  );
}

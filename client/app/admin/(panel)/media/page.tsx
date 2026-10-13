'use client';

import { PageHeader } from '@/components/admin/shell';
import MediaBrowser from '@/components/admin/media-browser';

export default function MediaPage() {
  return (
    <>
      <PageHeader
        title="Media library"
        description="Every image and video on the site lives here. Uploads are resized and converted to WebP automatically."
      />
      <div className="rounded-2xl border border-stone-200 bg-white p-4 md:p-6">
        <MediaBrowser mode="manage" />
      </div>
    </>
  );
}

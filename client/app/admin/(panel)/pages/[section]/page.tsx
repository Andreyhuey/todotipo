'use client';

import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/admin/shell';
import { AboutEditor, HeadersEditor, HomeEditor, LegalEditor } from '@/components/admin/page-editors';

const sections = {
  home: { title: 'Home page', description: 'Hero slides, sections and calls to action.', Editor: HomeEditor },
  about: { title: 'About page', description: 'Your story, values and sustainability commitments.', Editor: AboutEditor },
  headers: { title: 'Page headers', description: 'Banner titles and images for inner pages.', Editor: HeadersEditor },
  legal: { title: 'Legal pages', description: 'Privacy policy and terms & conditions.', Editor: LegalEditor },
};

export default function PageSectionEditor({ params }: { params: { section: string } }) {
  const section = sections[params.section as keyof typeof sections];
  if (!section) notFound();
  const { title, description, Editor } = section;

  return (
    <>
      <PageHeader title={title} description={description} />
      <Editor />
    </>
  );
}

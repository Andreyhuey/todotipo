import DesignCaseComponent from '@/components/design-cases/design-case-component';
import { designCases } from '@/constants/design-case.data';
import { siteInfo } from '@/constants/site.data';
import { routes } from '@/lib/routes';
import { toSlug } from '@/lib/toSlug';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { id: string; name: string };
}): Promise<Metadata> {
  const product = designCases.find((p) => p.id === Number(params.id));
  if (!product) return {};

  const title = `${product.name} | ${siteInfo.name}`;
  const description = `Explore details about ${product.name.toLowerCase()} in our design cases.`;
  const image = product.seoImage
    ? product.seoImage
    : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${
        product.seoImage ?? ''
      }`;

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image }] },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function DesignCasePage({
  params,
}: {
  params: { id: string; name: string };
}) {
  const product = designCases.find((p) => p.id == Number(params.id));

  if (!product) return notFound();

  const correctSlug = toSlug(product.name);
  if (params.name !== correctSlug) {
    return redirect(routes.designCaseDetails(params.id, correctSlug));
  }
  return <DesignCaseComponent designCase={product} />;
}

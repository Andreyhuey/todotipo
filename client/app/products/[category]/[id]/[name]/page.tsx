// app/products/[category]/[id]/[name]/page.tsx
import ProductDesc from '@/components/products/product-desc';
import { ProductCategoryValue, products } from '@/constants/product.data';
import { siteInfo } from '@/constants/site.data';
import { toSlug } from '@/lib/toSlug';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

function toCapitalCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; name: string; id: string };
}): Promise<Metadata> {
  const product = products.find((p) => p.id === Number(params.id));
  if (!product) return {};

  const title = `${product.title} | ${toCapitalCase(product.category)} | ${
    siteInfo.name
  }`;
  const description = `Explore details about ${product.title.toLowerCase()} in our ${
    product.category
  } collection.`;
  const image = product.seoImage
    ? product.seoImage
    : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${
        product.seoImage ?? ''
      }`;

  return {
    title,
    description,
    icons: image,
    openGraph: { title, description, images: [{ url: image }] },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function ProductPage({
  params,
}: {
  params: { category: string; name: string; id: string };
}) {
  const product = products.find((p) => p.id === Number(params.id));
  if (!product) return notFound();

  const correctSlug = toSlug(product.title);
  if (params.name !== correctSlug) {
    return redirect(`/products/${params.category}/${params.id}/${correctSlug}`);
  }

  return (
    <ProductDesc
      productCategory={params.category as ProductCategoryValue}
      product={product}
    />
  );
}

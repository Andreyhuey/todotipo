'use client';

import ProductCategorySelector from '@/components/products/product-category-selector';
import ShowView from '@/components/show-view';
import { ProductCategoryValue, Products } from '@/constants/product.data';
import Image from 'next/image';
import ProductTitleHeader from './product-title-header';
import ProductDescHeader from './product-desc-header';
import { Button } from '../ui/button';
import Modal from '../modal';
import QuoteProduct from './quote-product';
import Link from 'next/link';
import { toSlug } from '@/lib/toSlug';

export default function ProductDesc({
  product,
  products,
}: {
  product: Products;
  productCategory: ProductCategoryValue;
  products: Products[];
}) {
  // Find current product index in array
  const currentIndex = products.findIndex((p) => p.id === product.id);

  // Get previous and next products if they exist
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct =
    currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <div className="section">
        <div className="flex flex-col lg:flex-row gap-2 w-full h-full">
          <div className="flex-1 w-full h-full">
            {product.heroImage[0] && (
              <div className="relative aspect-square w-full h-full">
                <Image
                  src={product.heroImage[0]}
                  alt="about us"
                  fill
                  className="object-cover rounded"
                  unoptimized
                  priority
                />
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2 h-full w-full">
            {Array.isArray(product.heroImage) &&
              product.heroImage.slice(1, 5).map((item, index) => (
                <div key={index} className="relative aspect-square w-full">
                  <Image
                    src={item}
                    alt={`${product.title}-${index}`}
                    fill
                    className="object-cover rounded"
                    unoptimized
                    priority
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="section container h-full">
        <div className="flex flex-col lg:flex-row gap-7 w-full">
          <div className="w-full lg:w-3/12 ">
            <ProductCategorySelector />
          </div>
          <div className="w-full lg:w-9/12 h-full flex flex-col gap-7">
            <div className="flex lg:flex-row flex-col justify-between gap-3 h-full">
              <div className="lg:w-1/2 w-full h-full flex-1">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="w-full h-full border border-[#000000]"
                  unoptimized
                />
              </div>
              <div className="flex-1 flex flex-col justify-between items-stretch w-full lg:w-1/2 min-h-full gap-5 p-3">
                <h1 className="text-[32px] text-neutral-head font-medium">
                  {product.title}
                </h1>
                <div className="flex gap-2 items-center text-[#333333] font-[400] text-[24px]">
                  <p>Brand:</p> <p>{product?.brand}</p>
                </div>
                <div className="flex gap-2 items-center text-[#333333] font-[400] text-[24px]">
                  <p>Model:</p> <p>{product?.model}</p>
                </div>
                <div className="flex gap-2 items-center text-[#333333] font-[400] text-[24px]">
                  <p>Code:</p> <p>{product?.code}</p>
                </div>
                <div>
                  <Modal
                    trigger={
                      <Button className="w-fit px-4">Request Quote</Button>
                    }
                    hideCloseButton
                  >
                    {(close) => (
                      <QuoteProduct
                        close={close}
                        link=""
                        name={product.title}
                      />
                    )}
                  </Modal>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <ProductTitleHeader text="Product Description" />
              <div className="flex flex-col gap-3">
                {product?.desc?.map((paragraph, index) => (
                  <p key={index} className="mb-2 text-[#6b7280]">
                    {paragraph}
                  </p>
                ))}
              </div>
              <ShowView when={!!product.video}>
                <video
                  controls
                  className="w-full h-[600px] mx-auto rounded shadow"
                  src={product.video}
                >
                  Your browser does not support the video tag.
                </video>
              </ShowView>
              <ShowView when={!!product.addOns}>
                <div className="p-8 border border-[#EBEBEB] grid grid-cols-2 md:grid-cols-4 gap-8">
                  {product.addOns?.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex flex-col gap-2 items-center justify-center"
                    >
                      <Image
                        src={
                          Array.isArray(item.image) ? item.image[0] : item.image
                        }
                        key={` ${item}-${index}`}
                        alt={` ${item}-${index}`}
                        width={100}
                        height={100}
                        className="w-[80px] h-[80px]"
                        unoptimized
                      />
                      <p className="text-center">{item.name}</p>
                    </div>
                  ))}
                </div>
              </ShowView>
              {product?.descImages?.map((item, index) => (
                <Image
                  src={item}
                  key={` ${item}-${index}`}
                  alt={` ${item}-${index}`}
                  width={100}
                  height={100}
                  className="w-full h-full"
                  unoptimized
                />
              ))}
            </div>
            <ShowView when={!!product.case}>
              {product.case &&
                product.case.map((i, index) => (
                  <div
                    key={`${i.name}-${index}`}
                    className="flex flex-col gap-5"
                  >
                    <ProductTitleHeader text={i.name} />

                    <div className="flex flex-col gap-2">
                      {Array.isArray(i.image)
                        ? i.image.map((item, index) => (
                            <Image
                              src={item}
                              key={` ${item}-${index}`}
                              alt={` ${item}-${index}`}
                              width={100}
                              height={100}
                              className="w-full h-full"
                              unoptimized
                            />
                          ))
                        : i.image && (
                            <Image
                              src={i.image}
                              key={` ${i.image}-0`}
                              alt={` ${i.image}-0`}
                              width={100}
                              height={100}
                              className="w-full h-full"
                              unoptimized
                            />
                          )}
                    </div>
                    <ShowView when={!!i.specification}>
                      <div className="flex flex-col">
                        <ProductDescHeader text="Specifications" />

                        {i?.specification?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-x border-b"
                          >
                            <div className="flex-1 w-1/2 border-r p-3">
                              <p className="text-[#6B7280] font-[400]">
                                {item.name}
                              </p>
                            </div>
                            <div className="flex-1 w-1/2 text-end p-3 text-[#6B7280] font-[400]">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ShowView>
                  </div>
                ))}
            </ShowView>
            <ShowView when={!!product.plate}>
              {product.plate &&
                product.plate.map((plate, index) => (
                  <div key={`${plate.name}-${index}`}>
                    <ProductTitleHeader text={plate.name} />
                    <div className="p-6 border-x border-b border-[#EBEBEB]">
                      {Array.isArray(plate.image)
                        ? plate.image.map((item, index) => (
                            <Image
                              src={item}
                              key={` ${item}-${index}`}
                              alt={` ${item}-${index}`}
                              width={100}
                              height={100}
                              className="w-full h-full"
                              unoptimized
                            />
                          ))
                        : plate.image && (
                            <Image
                              src={plate.image}
                              key={` ${plate.image}-0`}
                              alt={` ${plate.image}-0`}
                              width={100}
                              height={100}
                              className="w-full h-full"
                              unoptimized
                            />
                          )}
                    </div>
                  </div>
                ))}
            </ShowView>
            <ShowView when={!!product.color}>
              {product.color &&
                product.color.map((color, index) => (
                  <div key={`${color.name}-${index}`}>
                    <ProductTitleHeader text={color.name} />
                    <div className="border-x border-b border-[#EBEBEB] flex flex-col gap-3">
                      {Array.isArray(color.image)
                        ? color.image.map((item, index) => (
                            <Image
                              src={item}
                              key={` ${item}-${index}`}
                              alt={` ${item}-${index}`}
                              width={100}
                              height={100}
                              className="w-full h-full"
                              unoptimized
                            />
                          ))
                        : color.image && (
                            <Image
                              src={color.image}
                              key={` ${color.image}-0`}
                              alt={` ${color.image}-0`}
                              width={100}
                              height={100}
                              className="w-full h-full"
                              unoptimized
                            />
                          )}
                    </div>
                  </div>
                ))}
            </ShowView>
            <ShowView when={!!product.specification}>
              <div className="flex flex-col">
                <ProductDescHeader text="Specifications" />

                {product?.specification?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-x border-b"
                  >
                    <div className="flex-1 w-1/2 border-r p-3">
                      <p className="text-[#6B7280] font-[400]">{item.name}</p>
                    </div>
                    <div className="flex-1 w-1/2 text-end p-3 text-[#6B7280] font-[400]">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </ShowView>
            <ShowView when={!!product.optionalColors}>
              <div>
                <ProductDescHeader text="Optional Colors" />
                <div className="grid grid-cols-3 gap-y-5 gap-x-8 p-7 border-x border-b border-[#EBEBEB]">
                  {product?.optionalColors?.map((item, index) => (
                    <div
                      key={`optional-colors-${item}-${index}`}
                      className="flex flex-col gap-1 items-center justify-center"
                    >
                      <Image
                        src={
                          Array.isArray(item.image) ? item.image[0] : item.image
                        }
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-full h-full"
                        unoptimized
                      />
                      <p className="font-[400] text-neutral-head">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ShowView>
            <ShowView when={!!product.surfaceTreatment}>
              <div>
                <ProductDescHeader text="Surface Treatment" />
                <div className="grid grid-cols-2 gap-y-5 gap-x-8 p-7 border-x border-b border-[#EBEBEB]">
                  {product?.surfaceTreatment?.map((item, index) => (
                    <div
                      key={`optional-colors-${item}-${index}`}
                      className="flex flex-col gap-1 items-center justify-center"
                    >
                      <Image
                        src={
                          Array.isArray(item.image) ? item.image[0] : item.image
                        }
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-full h-full"
                        unoptimized
                      />
                      <p className="font-[400] text-neutral-head">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ShowView>
            <ShowView when={!!product.collection}>
              {product?.collection &&
                product.collection.map((item, index) => (
                  <div
                    key={`${item.name}door-collection-${index}`}
                    className="flex flex-col gap-10"
                  >
                    <div className="flex flex-col gap-5">
                      <ProductTitleHeader text={item.name} />
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-full h-full"
                        unoptimized
                      />
                    </div>
                    <div>
                      <ProductDescHeader text={item.styles.name} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-8 items-center justify-between border-x border-b border-[#EBEBEB]">
                        {Array.isArray(item.styles.image) &&
                          item.styles.image.map((i) => (
                            <Image
                              key={`${item.styles.name}-${i}`}
                              src={i}
                              alt={i}
                              width={100}
                              height={100}
                              className="w-full h-full"
                              unoptimized
                            />
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-5">
                      {item.details &&
                        item.details.map((detail, index) => (
                          <div key={`${detail.name}-${index}`}>
                            <ProductDescHeader text={detail.name} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-8 items-center justify-between border-x border-b border-[#EBEBEB]">
                              {detail.types &&
                                detail.types.map((types, index) => (
                                  <div key={`${types.name}-${index}`}>
                                    <Image
                                      src={
                                        Array.isArray(types.image)
                                          ? types.image[0]
                                          : types.image
                                      }
                                      alt={`image of ${types.name}`}
                                      width={100}
                                      height={100}
                                      className="w-full h-full"
                                      unoptimized
                                    />
                                    <p className="text-center text-[#333333] body1 font-normal">
                                      {types.name}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </ShowView>
            <ShowView when={!!product.designSketches}>
              <div className="flex flex-col gap-6">
                <ProductTitleHeader text="Design Sketches" />
                {product.designSketches &&
                  product.designSketches.map((item, index) => (
                    <Image
                      src={item}
                      key={`${index}-${item}`}
                      alt={`image of ${index}-${item}`}
                      width={100}
                      height={100}
                      className="w-full h-full"
                      unoptimized
                    />
                  ))}
              </div>
            </ShowView>
            {/* Prev/Next navigation */}
            <div className="flex justify-between gap-2 mt-3">
              {prevProduct ? (
                <Link
                  href={`/products/${product.category}/${
                    prevProduct.id
                  }/${toSlug(prevProduct.title)}`}
                  className="btn-prev px-4 py-2 border rounded hover:bg-gray-100"
                >
                  ← Previous: {prevProduct.title}
                </Link>
              ) : (
                <div className="btn-prev px-4 py-2 border rounded bg-gray-300">
                  Previous: None
                </div>
              )}

              {nextProduct ? (
                <Link
                  href={`/products/${product.category}/${
                    nextProduct.id
                  }/${toSlug(nextProduct.title)}`}
                  className="btn-next px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Next: {nextProduct.title} →
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

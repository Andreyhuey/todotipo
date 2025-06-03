'use client';

import ProductCategorySelector from '@/components/products/product-category-selector';
import ShowView from '@/components/show-view';
import { ProductCategoryValue, Products } from '@/constants/product.data';
import Image from 'next/image';
import { useState } from 'react';
import ProductTitleHeader from './product-title-header';
import ProductDescHeader from './product-desc-header';
import { Button } from '../ui/button';

export default function ProductDesc({
  product,
  productCategory,
}: {
  product: Products;
  productCategory: ProductCategoryValue;
}) {
  const [category, setCategory] =
    useState<ProductCategoryValue>(productCategory);

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="flex flex-col lg:flex-row gap-2 w-full h-full">
          <div className="flex-1 w-full h-full">
            {product.heroImage[0] && (
              <div className="relative aspect-square w-full h-full">
                <Image
                  src={product.heroImage[0]}
                  alt="about us"
                  fill
                  className="object-cover rounded"
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
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="section container h-full">
        <div className="flex flex-col lg:flex-row gap-7 w-full">
          <div className="w-full lg:w-3/12 ">
            <ProductCategorySelector
              selected={category}
              onSelect={setCategory}
            />
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
                />
              </div>
              <div className="flex-1 flex flex-col justify-between items-stretch w-full lg:w-1/2 min-h-full p-3">
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
                <Button className="w-fit">Request Quote</Button>
              </div>
            </div>
            <ShowView when={!!product.desc}>
              <div className="flex flex-col gap-3">
                <ProductTitleHeader text="Product Description" />
                <div className="flex flex-col gap-3">
                  {product?.desc?.map((paragraph, index) => (
                    <p key={index} className="mb-2 text-[#6b7280]">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {product?.descImages?.map((item, index) => (
                  <Image
                    src={item}
                    key={` ${item}-${index}`}
                    alt={` ${item}-${index}`}
                    width={100}
                    height={100}
                    className="w-full h-full"
                  />
                ))}
              </div>
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
                      />
                      <p className="font-[400] text-neutral-head">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ShowView>
          </div>
        </div>
      </div>
    </div>
  );
}

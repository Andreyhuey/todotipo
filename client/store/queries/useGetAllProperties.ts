"use client";

import { useQuery } from "@tanstack/react-query";
import ReactQueryKeys from "../keys";
import { useApi } from "../fetch-api";
import { manageLinkSpace } from "@/lib/manageLinkSpace";
import { PropertiesResponse } from "@/interfaces/property.interfaces";
import { ApiRoutes } from "@/lib/api-routes";

const getProperties = async (
  page?: number,
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<PropertiesResponse> => {
  const params = new URLSearchParams();

  if (page) params.append("page", page.toString());
  if (category) params.append("category", category);
  if (search) params.append("search", search);
  if (minPrice) params.append("minPrice", minPrice.toString());
  if (maxPrice) params.append("maxPrice", maxPrice.toString());

  const url = `${ApiRoutes.apiViewAllProperties()}?${manageLinkSpace(params)}`;

  const response = await useApi.get(url);

  return response;
};

const useGetProperties = (
  page?: number,
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  return useQuery({
    queryKey: [
      ReactQueryKeys.VIEW_PROPERTIES,
      page,
      category,
      search,
      minPrice,
      maxPrice,
    ],
    queryFn: () => getProperties(page, category, search, minPrice, maxPrice),
    retry: false,
  });
};

export default useGetProperties;

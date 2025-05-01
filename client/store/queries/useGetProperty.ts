"use client";

import { useQuery } from "@tanstack/react-query";
import ReactQueryKeys from "../keys";
import { PropertyResponse } from "@/interfaces/property.interfaces";
import { useApi } from "../fetch-api";
import { ApiRoutes } from "@/lib/api-routes";

const getProperty = async (id: string): Promise<PropertyResponse> => {
  const response = await useApi.get(ApiRoutes.apiViewProperty(id));

  return response;
};

const useGetProperty = (id: string) => {
  return useQuery({
    queryKey: [ReactQueryKeys.PROPERTIES, id],
    queryFn: () => getProperty(id),
  });
};

export default useGetProperty;

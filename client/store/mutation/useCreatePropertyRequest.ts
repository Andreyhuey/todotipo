import { useMutation } from "@tanstack/react-query";
import ReactQueryKeys from "../keys";
import { useApi } from "../fetch-api";
import { toast } from "sonner";
import { ApiRoutes } from "@/lib/api-routes";

export interface PropertyRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
  price: string;
  id: string;
}

interface PropertyRequestResponse {
  success: boolean;
  message: string;
}

const createProperty = async (
  data: PropertyRequest
): Promise<PropertyRequestResponse> => {
  const response = await useApi.post(ApiRoutes.apiSendPropertyRequest(), data);

  return response;
};

const useCreatePropertyRequest = () => {
  return useMutation({
    mutationKey: [ReactQueryKeys.REQUEST_PROPERTY],
    mutationFn: createProperty,
    onSuccess: () => {
      toast.success("Property Request sent successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export default useCreatePropertyRequest;

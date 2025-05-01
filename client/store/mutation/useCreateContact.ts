import { useMutation } from "@tanstack/react-query";
import ReactQueryKeys from "../keys";
import { useApi } from "../fetch-api";
import { toast } from "sonner";
import { ApiRoutes } from "@/lib/api-routes";

export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
  subject: string;
}

interface ContactRequestResponse {
  success: boolean;
  message: string;
}

const createProperty = async (
  data: ContactRequest
): Promise<ContactRequestResponse> => {
  const response = await useApi.post(ApiRoutes.apiSendContactMail(), data);

  return response;
};

const useCreateContactRequest = () => {
  return useMutation({
    mutationKey: [ReactQueryKeys.SEND_MAIL],
    mutationFn: createProperty,
    onSuccess: () => {
      toast.success("Contact request sent successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export default useCreateContactRequest;

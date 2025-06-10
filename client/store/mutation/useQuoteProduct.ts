import { useMutation } from '@tanstack/react-query';
import ReactQueryKeys from '../keys';
import { useApi } from '../fetch-api';
import { toast } from 'sonner';
import { ApiRoutes } from '@/lib/api-routes';
import { ProjectTypeEnum } from '@/lib/validator';

export interface QuoteProductRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  quantity: string;
  message: string;
  projectType: ProjectTypeEnum;
  link: string;
}

interface QuoteProductResponse {
  status: boolean;
  message: string;
}

const createQuote = async (
  data: QuoteProductRequest
): Promise<QuoteProductResponse> => {
  const response = await useApi.post(ApiRoutes.apiQuoteProduct(), data);

  return response;
};

const useQuoteProduct = () => {
  return useMutation({
    mutationKey: [ReactQueryKeys.QUOTE_PRODUCT],
    mutationFn: createQuote,
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export default useQuoteProduct;

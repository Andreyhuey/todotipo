import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useApi } from '../fetch-api';
import ReactQueryKeys from '../keys';
import { ApiRoutes } from '@/lib/api-routes';

export interface SubscribeRequest {
  email: string;
}

interface SubscribeResponse {
  status: boolean;
  message: string;
}

const subscribeUser = async (
  data: SubscribeRequest
): Promise<SubscribeResponse> => {
  const response = await useApi.post(ApiRoutes.apiSubscribe(), data);
  return response;
};

const useSubscribe = () => {
  return useMutation({
    mutationKey: [ReactQueryKeys.SUBSCRIBE],
    mutationFn: subscribeUser,
    onSuccess: (res) => {
      toast.success(res.message || 'Subscribed successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Subscription failed');
    },
  });
};

export default useSubscribe;

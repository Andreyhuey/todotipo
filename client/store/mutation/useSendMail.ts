import { useMutation } from '@tanstack/react-query';
import ReactQueryKeys from '../keys';
import { useApi } from '../fetch-api';
import { toast } from 'sonner';
import { ApiRoutes } from '@/lib/api-routes';

export interface MailRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
  subject: string;
}

interface MailRequestResponse {
  status: boolean;
  message: string;
}

const sendMail = async (data: MailRequest): Promise<MailRequestResponse> => {
  const response = await useApi.post(ApiRoutes.apiSendMail(), data);

  return response;
};

const useSendMail = () => {
  return useMutation({
    mutationKey: [ReactQueryKeys.SEND_MAIL],
    mutationFn: sendMail,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export default useSendMail;

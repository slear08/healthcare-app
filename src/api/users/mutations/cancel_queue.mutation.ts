import { Axios } from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CancelQueueResponse {
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const cancelUserQueue = async (queueId: string): Promise<CancelQueueResponse> => {
    const response = await Axios.put<CancelQueueResponse>(`/api/queue/user/update/queue/${queueId}`);
    return response.data;
};

export const useCancelQueue = () => {
    const queryClient = useQueryClient();
    return useMutation<CancelQueueResponse, Error, string>({
        mutationFn: cancelUserQueue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeQueue'] });
            queryClient.invalidateQueries({ queryKey: ['queueHistory'] });
        },
    });
};

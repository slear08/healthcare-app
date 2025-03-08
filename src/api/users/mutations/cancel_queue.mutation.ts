import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface CancelQueueResponse {
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const cancelUserQueue = async (queueId: number): Promise<CancelQueueResponse> => {
    const response = await Axios.put<CancelQueueResponse>(`/api/queue/cancel/${queueId}`);
    return response.data;
};

export const useCancelQueue = () => {
    return useMutation<CancelQueueResponse, Error, number>({
        mutationFn: cancelUserQueue,
    });
};

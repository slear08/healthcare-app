import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface QueueHistoryResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queueList: any[];
}

const fetchQueueHistory = async (): Promise<QueueHistoryResponse> => {
    const response = await Axios.get<QueueHistoryResponse>(`/api/queue/user/history-list`);
    return response.data;
};

export const useQueueHistory = () => {
    return useQuery<QueueHistoryResponse, Error>({
        queryKey: ['queueHistory'],
        queryFn: () => fetchQueueHistory(),
        staleTime: 5000,
    });
};

import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface HistoryItem {
    purpose: string;
    timeSchedule: string;
    status: string;
}
interface QueueHistoryResponse {
    message: string;
    data: HistoryItem[];
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

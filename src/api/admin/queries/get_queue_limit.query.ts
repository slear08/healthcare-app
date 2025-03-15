import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface QueueLimitResponse {
    success: boolean;
    data: {
        status: 'ON' | 'OFF';
        limit: number;
        createdAt: string;
        updatedAt: string;
    };
}

export const useQueueLimit = () => {
    return useQuery({
        queryKey: ['queue-limit'],
        queryFn: async () => {
            const { data } = await Axios.get<QueueLimitResponse>('/api/queue-limit/settings');
            return data.data;
        },
        retry: false,
    });
};

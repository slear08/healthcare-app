import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface ActiveQueueResponse {
    position: number | null;
    totalWaiting: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userQueue: any[];
}

const fetchActiveQueue = async (): Promise<ActiveQueueResponse> => {
    const response = await Axios.get<ActiveQueueResponse>(`/api/queue/active-queue`);
    return response.data;
};

export const useActiveQueue = () => {
    return useQuery<ActiveQueueResponse, Error>({
        queryKey: ['activeQueue'],
        queryFn: () => fetchActiveQueue(),
        staleTime: 5000,
    });
};

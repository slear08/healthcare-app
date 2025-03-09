import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface ActiveQueueData {
    position: number | null;
    totalWaiting: number;
    userQueue: {
        deletedAt: string | null;
        _id: string;
        userId: string;
        status: string;
        purpose: string;
        timeSchedule: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    }[];
}

interface ActiveQueueResponse {
    message: string;
    data: ActiveQueueData;
}

interface ActiveQueueResponse {
    message: string;
    data: ActiveQueueData;
}

const fetchActiveQueue = async (): Promise<ActiveQueueResponse> => {
    const response = await Axios.get<ActiveQueueResponse>(`/api/queue/active-queue`);
    return response.data;
};

export const useActiveQueue = () => {
    return useQuery<ActiveQueueResponse, Error>({
        queryKey: ['activeQueue'],
        queryFn: () => fetchActiveQueue(),
        // staleTime: 50000,
        // refetchInterval: 5000,
    });
};

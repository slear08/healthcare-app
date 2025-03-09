import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface QueueListParams {
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

interface PaginatedResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queueList: any[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

const fetchQueueList = async (params: QueueListParams): Promise<PaginatedResponse> => {
    const response = await Axios.get<PaginatedResponse>('/api/queue/list', { params });
    return response.data;
};

export const useQueueList = (params: QueueListParams) => {
    return useQuery<PaginatedResponse, Error>({
        queryKey: ['queueList', params],
        queryFn: () => fetchQueueList(params),
        staleTime: 5000,
    });
};

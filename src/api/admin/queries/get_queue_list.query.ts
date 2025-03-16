import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

type QueueStatus = 'waiting' | 'in-progress' | 'completed' | 'cancelled';
type SortOrder = 'asc' | 'desc';

interface QueueListParams {
    status?: QueueStatus;
    sort?: `${keyof Queue}:${SortOrder}`;
    page?: number;
    limit?: number;
    search?: string;
    purpose?: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    profile: string;
}

interface Queue {
    _id: string;
    status: QueueStatus;
    purpose: string;
    timeSchedule: string;
    user: User;
}

interface QueueListResponse {
    queueList: Queue[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export const useQueueList = (params: QueueListParams = {}) => {
    const { status, sort, page = 1, limit = 10, search, purpose } = params;

    return useQuery({
        queryKey: ['queue-list', { status, sort, page, limit, search, purpose }],
        queryFn: async () => {
            try {
                // Build query string
                const queryParams = new URLSearchParams();
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());
                if (status) queryParams.append('status', status);
                if (sort) queryParams.append('sort', sort);
                if (search) queryParams.append('search', search);
                if (purpose && purpose !== 'all') queryParams.append('purpose', purpose);

                const { data } = await Axios.get<QueueListResponse>(`/api/queue/list?${queryParams.toString()}`);

                return data;
            } catch (error) {
                console.error('Error fetching queue list:', error);
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

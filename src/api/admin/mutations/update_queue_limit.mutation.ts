import { Axios } from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateQueueLimitRequest {
    status: 'ON' | 'OFF';
    limit: number;
}

interface UpdateQueueLimitResponse {
    success: boolean;
    data: {
        status: 'ON' | 'OFF';
        limit: number;
        createdAt: string;
        updatedAt: string;
    };
}

export const useUpdateQueueLimit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateQueueLimitRequest) => {
            const response = await Axios.put<UpdateQueueLimitResponse>('/api/queue/update-queue', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue-limit'] });
        },
    });
};

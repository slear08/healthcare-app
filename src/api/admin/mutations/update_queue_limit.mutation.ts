import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface UpdateQueueLimitRequest {
    status: 'ON' | 'OFF';
    limit: number;
}

interface UpdateQueueLimitResponse {
    status: 'ON' | 'OFF';
    limit: number;
}

const updateQueueLimit = async ({ status, limit }: UpdateQueueLimitRequest): Promise<UpdateQueueLimitResponse> => {
    const response = await Axios.put<UpdateQueueLimitResponse>('/api/queue/update-queue', { status, limit });
    return response.data;
};

export const useUpdateQueueLimit = () => {
    return useMutation<UpdateQueueLimitResponse, Error, UpdateQueueLimitRequest>({
        mutationFn: updateQueueLimit,
    });
};

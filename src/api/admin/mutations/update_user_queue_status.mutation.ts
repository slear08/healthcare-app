import { Axios } from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type QueueStatus = 'waiting' | 'in-progress' | 'completed' | 'cancelled';

interface UpdateQueueStatusRequest {
    userId: string;
    queueId: string;
    status: QueueStatus;
}

interface UpdateQueueStatusResponse {
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const updateUserQueueStatus = async ({
    userId,
    queueId,
    status,
}: UpdateQueueStatusRequest): Promise<UpdateQueueStatusResponse> => {
    const response = await Axios.put<UpdateQueueStatusResponse>(`/api/queue/user-list/update/${userId}/${queueId}`, {
        status,
    });
    return response.data;
};

export const useUpdateQueueStatus = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateQueueStatusResponse, Error, UpdateQueueStatusRequest>({
        mutationFn: updateUserQueueStatus,
        onSuccess: () => {
            // Invalidate and refetch the queue list
            queryClient.invalidateQueries({ queryKey: ['queue-list'] });
        },
    });
};

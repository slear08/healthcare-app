import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface UpdateQueueStatusRequest {
    queueId: string;
    status: 'waiting' | 'in-progress' | 'completed';
}

interface UpdateQueueStatusResponse {
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const updateUserQueueStatus = async ({
    queueId,
    status,
}: UpdateQueueStatusRequest): Promise<UpdateQueueStatusResponse> => {
    const response = await Axios.put<UpdateQueueStatusResponse>(`/api/queue/update/${queueId}`, { status });
    return response.data;
};

export const useUpdateQueueStatus = () => {
    return useMutation<UpdateQueueStatusResponse, Error, UpdateQueueStatusRequest>({
        mutationFn: updateUserQueueStatus,
    });
};

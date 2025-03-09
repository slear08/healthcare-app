import { Axios } from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateQueueRequest {
    purpose: string;
}

interface CreateQueueResponse {
    status: string;
    purpose: string;
    timeSchedule: string;
}

const createQueue = async ({ purpose }: CreateQueueRequest): Promise<CreateQueueResponse> => {
    const response = await Axios.post<CreateQueueResponse>('/api/queue/create', { purpose });
    return response.data;
};

export const useCreateQueue = () => {
    const queryClient = useQueryClient();
    return useMutation<CreateQueueResponse, Error, CreateQueueRequest>({
        mutationFn: createQueue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeQueue'] });
        },
    });
};

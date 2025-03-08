import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface CreateQueueRequest {
    purpose: string;
}

interface CreateQueueResponse {
    message: string;
}

const createQueue = async ({ purpose }: CreateQueueRequest): Promise<CreateQueueResponse> => {
    const response = await Axios.post<CreateQueueResponse>('/api/queue/create', { purpose });
    return response.data;
};

export const useCreateQueue = () => {
    return useMutation<CreateQueueResponse, Error, CreateQueueRequest>({
        mutationFn: createQueue,
    });
};

import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface PassportSuccessResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

const fetchPassportSuccess = async (): Promise<PassportSuccessResponse> => {
    const response = await Axios.get<PassportSuccessResponse>('/api/login/success');
    return response.data;
};

export const usePassportSuccess = (options?: { enabled?: boolean }) => {
    return useQuery<PassportSuccessResponse, Error>({
        queryKey: ['passportSuccess'],
        queryFn: fetchPassportSuccess,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
        enabled: options?.enabled ?? true,
    });
};

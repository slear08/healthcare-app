import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface VerifyUserRequest {
    name: string;
    mobileNumber: string;
}

interface VerifyUserResponse {
    message: string;
    user: {
        name: string;
        email: string;
        mobileNumber: string;
        isVerified: boolean;
    };
}

const verifyUser = async (data: VerifyUserRequest): Promise<VerifyUserResponse> => {
    const response = await Axios.put<VerifyUserResponse>('/api/user/verify', data);
    return response.data;
};

export const useVerifyUser = () => {
    return useMutation<VerifyUserResponse, Error, VerifyUserRequest>({
        mutationFn: verifyUser,
    });
};

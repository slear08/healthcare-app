import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

interface ChangePasswordResponse {
    message: string;
}

const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await Axios.put<ChangePasswordResponse>('/api/auth/change-password', data);
    return response.data;
};

export const useChangePassword = () => {
    return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
        mutationFn: changePassword,
    });
};

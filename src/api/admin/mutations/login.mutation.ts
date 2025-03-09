import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    user: {
        name: string;
        role: string;
    };
    auth: {
        token: string;
        refreshToken: string;
    };
}

const loginAdmin = async ({ email, password }: LoginRequest): Promise<LoginResponse> => {
    const response = await Axios.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
};

export const useAdminLogin = () => {
    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginAdmin,
        onSuccess: (data) => {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('auth', JSON.stringify(data.auth));
        },
    });
};

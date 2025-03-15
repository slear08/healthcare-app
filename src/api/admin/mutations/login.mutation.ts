import { Axios } from '@/api/axios';
import { useAuthStore } from '@/store/auth';
import { useMutation } from '@tanstack/react-query';

type Role = 'USER' | 'ADMIN';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    user: {
        name: string;
        role: Role;
    };
    auth: {
        token: string;
        refreshToken: string;
    };
}

const loginAdmin = async ({ email, password }: LoginRequest): Promise<LoginResponse> => {
    const response = await Axios.post<LoginResponse>('/api/auth/login', { email, password });
    return response.data;
};

export const useAdminLogin = () => {
    const login = useAuthStore((state) => state.login);

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginAdmin,
        onSuccess: (data) => {
            localStorage.setItem('auth', JSON.stringify(data.auth));

            login(data.user.name, data.user.role);
        },
    });
};

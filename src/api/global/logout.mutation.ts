import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface LogoutResponse {
    message: string;
}

const logoutUser = async (): Promise<LogoutResponse> => {
    const response = await Axios.post<LogoutResponse>('/api/auth/logout');
    return response.data;
};

export const useLogout = () => {
    return useMutation<LogoutResponse, Error>({
        mutationFn: logoutUser,
        onSuccess: () => {
            localStorage.removeItem('user');
            localStorage.removeItem('auth');
            sessionStorage.clear();

            document.cookie.split(';').forEach((cookie) => {
                const [name] = cookie.split('=');
                document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            });
        },
    });
};

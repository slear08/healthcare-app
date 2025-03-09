import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface UserListResponse {
    message: string;
    data: User[];
}

const fetchUserList = async (): Promise<UserListResponse> => {
    const response = await Axios.get<UserListResponse>('/api/users');
    return response.data;
};

export const useUserList = () => {
    return useQuery<UserListResponse, Error>({
        queryKey: ['userList'],
        queryFn: fetchUserList,
        staleTime: 5000,
    });
};

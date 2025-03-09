import { useEffect } from 'react';

import { usePassportSuccess } from '@/api/users/queries/get_user.query';
import { useAuthStore } from '@/store/auth';

import AdminDashboardPage from '../admin/dashboard';
import LoginPage from '../login';
import UserDashboard from '../user_dashboard';

const HomePage = () => {
    const { data } = usePassportSuccess();
    const { login } = useAuthStore();

    useEffect(() => {
        if (data?.user) {
            console.log('Logging in user:', data.user);
            login(data.user.name, data.user.role as 'USER');
        }
    }, [data, login]);

    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <LoginPage />;
    }

    return user.role === 'ADMIN' ? <AdminDashboardPage /> : <UserDashboard />;
};

export default HomePage;

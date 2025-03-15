import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { usePassportSuccess } from '@/api/users/queries/get_user.query';
import { useAuthStore } from '@/store/auth';

import AdminDashboardPage from '../admin/dashboard';
import { LoginAdmin } from '../admin/login';
import LoginPage from '../login';
import UserDashboard from '../user_dashboard';

const HomePage = () => {
    const { user: authUser, isAuthenticated, login } = useAuthStore();
    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith('/admin');

    const shouldCheckPassport = !isAuthenticated || authUser?.role !== 'ADMIN';

    const { data } = usePassportSuccess({
        enabled: shouldCheckPassport,
    });

    useEffect(() => {
        if (data?.user && !isAuthenticated) {
            login(data.user.name, data.user.role as 'USER');
        }
    }, [data, login, isAuthenticated]);

    if (!isAuthenticated || !authUser) {
        return isAdminRoute ? <LoginAdmin /> : <LoginPage />;
    }

    return authUser.role === 'ADMIN' ? <AdminDashboardPage /> : <UserDashboard />;
};

export default HomePage;

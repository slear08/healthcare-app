import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { usePassportSuccess } from '@/api/users/queries/get_user.query';
import { OfflineFallback } from '@/components/OfflineFallback';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAuthStore } from '@/store/auth';

import AdminDashboardPage from '../admin/dashboard';
import { LoginAdmin } from '../admin/login';
import LoginPage from '../login';
import UserDashboard from '../user_dashboard';
import UserSetup from '../user_setup';

const HomePage = () => {
    const { user: authUser, isAuthenticated, login } = useAuthStore();
    const location = useLocation();
    const isOnline = useOnlineStatus();

    const isAdminRoute = location.pathname.startsWith('/admin');

    const shouldCheckPassport = !isAuthenticated || authUser?.role !== 'ADMIN';

    const { data, isError } = usePassportSuccess({
        enabled: shouldCheckPassport && isOnline,
    });

    useEffect(() => {
        if (data?.user && !isAuthenticated) {
            login(data.user.name, data.user.role as 'USER', data.user.profile, data.user.mobileNumber);
        }
    }, [data, login, isAuthenticated]);

    // Show offline fallback for authenticated users when offline
    if (!isOnline && isAuthenticated) {
        return <OfflineFallback />;
    }

    // Show login pages when not authenticated or when online but authentication failed
    if (!isAuthenticated || (isOnline && isError)) {
        return isAdminRoute ? <LoginAdmin /> : <LoginPage />;
    }

    if (authUser?.role === 'ADMIN') {
        return <AdminDashboardPage />;
    }

    if (authUser?.role === 'USER') {
        // When offline, always show the dashboard instead of setup
        if (!isOnline || data?.user.isVerified) {
            return <UserDashboard />;
        }

        return <UserSetup />;
    }

    return null;
};

export default HomePage;

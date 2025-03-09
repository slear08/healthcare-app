import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth';

type Role = 'USER' | 'ADMIN';

interface RoleBasedRouteProps {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
};

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppointmentPage from '@/page/appointment';
import ReminderPage from '@/page/reminder';

import { RoleBasedRoute } from './components/auth/auth_route.component';
import { OfflineFallback } from './components/OfflineFallback';
import QueueUpdates from './hooks/queueUpdates';
import { LoginAdmin } from './page/admin/login';
import HomePage from './page/home';
import InstallationPage from './page/installation';
import LoginPage from './page/login';
import UserSetup from './page/user_setup';

function App() {
    const router = createBrowserRouter([
        {
            path: '/login',
            element: <LoginPage />,
        },
        {
            path: '/admin/login',
            element: <LoginAdmin />,
        },
        {
            path: '/test',
            element: <OfflineFallback />,
        },
        {
            path: '/',
            element: <HomePage />,
        },
        {
            path: '/installation',
            element: <InstallationPage />,
        },
        {
            path: '/profile-edit',
            element: (
                <RoleBasedRoute allowedRoles={['USER']}>
                    <QueueUpdates>
                        <UserSetup />
                    </QueueUpdates>
                </RoleBasedRoute>
            ),
        },
        {
            path: '/appointment',
            element: (
                <RoleBasedRoute allowedRoles={['USER']}>
                    <QueueUpdates>
                        <AppointmentPage />
                    </QueueUpdates>
                </RoleBasedRoute>
            ),
        },
        {
            path: '/reminders',
            element: (
                <RoleBasedRoute allowedRoles={['USER']}>
                    <QueueUpdates>
                        <ReminderPage />
                    </QueueUpdates>
                </RoleBasedRoute>
            ),
        },
    ]);

    return (
        <div className="bg-teal-50">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;

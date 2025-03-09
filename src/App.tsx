import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppointmentPage from '@/page/appointment';
import ReminderPage from '@/page/reminder';

import { RoleBasedRoute } from './components/auth/auth_route.component';
import HomePage from './page/home';
import LoginPage from './page/login';

function App() {
    const router = createBrowserRouter([
        {
            path: '/login',
            element: <LoginPage />,
        },
        {
            path: '/',
            element: <HomePage />,
        },
        {
            path: '/appointment',
            element: (
                <RoleBasedRoute allowedRoles={['USER']}>
                    <AppointmentPage />
                </RoleBasedRoute>
            ),
        },
        {
            path: '/reminders',
            element: (
                <RoleBasedRoute allowedRoles={['USER']}>
                    <ReminderPage />
                </RoleBasedRoute>
            ),
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;

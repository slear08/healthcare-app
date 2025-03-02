import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AdminDashboardPage from '@/page/admin/dashboard';
import AppointmentPage from '@/page/appointment';
import LoginPage from '@/page/login';
import ReminderPage from '@/page/reminder';
import UserDashboard from '@/page/user_dashboard';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <LoginPage />,
        },
        {
            path: '/user-dashboard',
            element: <UserDashboard />,
        },
        {
            path: '/admin-dashboard',
            element: <AdminDashboardPage />,
        },
        {
            path: '/appointment',
            element: <AppointmentPage />,
        },
        {
            path: '/reminders',
            element: <ReminderPage />,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;

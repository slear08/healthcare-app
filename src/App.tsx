import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from '@/page/login';
import UserDashboard from '@/page/user_dashboard';

import ReminderPage from './page/reminder';

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
            path: '/user-reminder',
            element: <ReminderPage />,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;

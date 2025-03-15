import { BarChart, Clock, KeyRound, LogOut, Power, User, Users } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useLogout } from '@/api/global/logout.mutation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

import { QueueChart } from './component/queue_chart.component';
import { QueueTable } from './component/queue_table.component';

export default function AdminDashboardPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    const { mutateAsync: logout } = useLogout();
    const { logout: logoutStore } = useAuthStore();

    const handleLogoutClick = () => {
        setIsOpen(false); // Close dropdown
        setShowLogoutConfirm(true); // Show confirmation dialog
    };

    const handleLogout = async () => {
        try {
            await toast.promise(logout(), {
                loading: 'Logging out...',
                success: () => {
                    logoutStore();
                    navigate('/admin/login');
                    return 'Logged out successfully';
                },
                error: 'Failed to logout',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="container mx-auto py-10 px-24 bg-teal-50 ">
            <div className="flex justify-between items-center mb-6  ">
                <h1 className="text-2xl font-bold text-teal-700">Monitoring Dashboard</h1>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-teal-700 font-semibold">Admin</span>
                            <Button className="rounded-full w-10 h-10 p-0 bg-teal-700 hover:bg-teal-500">
                                <User className="h-5 w-5" />
                            </Button>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <KeyRound className="h-4 w-4" />
                            <span>Change Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700"
                            onClick={handleLogoutClick}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will need to login again to access the admin dashboard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
                            Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <div className="flex flex-col justify-around gap-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-teal-700">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-teal-500">1,234</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-teal-700">Waiting Queue</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-teal-500">56</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-teal-700">Queue Status</CardTitle>
                            <Power className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-teal-500">Active</div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-teal-700">Weekly New Registered User</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <QueueChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-teal-700">Weekly Queue Trend</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex justify-center items-center">
                        <QueueChart />
                    </CardContent>
                </Card>
            </div>
            <QueueTable />
        </div>
    );
}

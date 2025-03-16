import { BarChart, Clock, KeyRound, LogOut, Power, User, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useChangePassword } from '@/api/admin/mutations/change_password.mutation';
import { useDashboardData } from '@/api/admin/queries/get_data_analytics.query';
import { useLogout } from '@/api/global/logout.mutation';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import { QueueChart } from './component/queue_chart.component';
import { QueueTable } from './component/queue_table.component';

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function AdminDashboardPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const navigate = useNavigate();
    const { mutateAsync: logout } = useLogout();
    const { logout: logoutStore } = useAuthStore();
    const { data: dashboardData, isLoading } = useDashboardData();
    const { mutateAsync: changePassword } = useChangePassword();

    const form = useForm<ChangePasswordForm>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const handleChangePasswordClick = () => {
        setIsOpen(false);
        setShowChangePassword(true);
    };

    const onChangePasswordSubmit = async (data: ChangePasswordForm) => {
        try {
            await toast.promise(
                changePassword({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
                {
                    loading: 'Changing password...',
                    success: () => {
                        setShowChangePassword(false);
                        form.reset();
                        return 'Password changed successfully';
                    },
                    error: 'Failed to change password',
                }
            );
        } catch (error) {
            console.error('Change password error:', error);
            // Don't close dialog on error
        }
    };

    const handleLogoutClick = () => {
        setIsOpen(false);
        setShowLogoutConfirm(true);
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
        <div className="container mx-auto py-10 px-24">
            <div className="flex justify-between items-center mb-6">
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
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            onClick={handleChangePasswordClick}
                        >
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

            <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and a new password to change it.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onChangePasswordSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setShowChangePassword(false);
                                        form.reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button className="bg-teal-700 hover:bg-teal-500" type="submit">
                                    Change Password
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-teal-700">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-teal-500">{dashboardData?.totalUsers || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-teal-700">Waiting Today</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-teal-500">{dashboardData?.totalWaitingToday || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-teal-700">Queue Limit</CardTitle>
                        <Power className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-teal-500">
                                {dashboardData?.queueLimit.limit || 0}
                            </div>
                            <div
                                className={`text-sm font-medium ${
                                    dashboardData?.queueLimit.status === 'ON' ? 'text-green-500' : 'text-red-500'
                                }`}
                            >
                                ({dashboardData?.queueLimit.status || 'OFF'})
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-4 mb-10">
                <Card className="w-1/2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-teal-700">Weekly New Users</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <QueueChart data={dashboardData?.weeklyTrend.newUsers || []} isLoading={isLoading} />
                    </CardContent>
                </Card>
                <Card className="w-1/2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-teal-700">Weekly Queue Trend</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <QueueChart data={dashboardData?.weeklyTrend.totalQueues || []} isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>

            <QueueTable />
        </div>
    );
}

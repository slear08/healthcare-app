import { motion } from 'framer-motion';
import { Calendar, Clock, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth';
import { useQueryClient } from '@tanstack/react-query';

export default function UserDashboard() {
    const navigate = useNavigate();
    const { mutate } = useLogout();
    const { logout, user } = useAuthStore();
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        mutate(undefined, {
            onSuccess: () => {
                queryClient.removeQueries();
                navigate('/login', { replace: true });
                logout();
            },
        });
    };

    const handleSettingsClick = () => {
        setIsOpen(false);
        navigate('/profile-edit');
    };

    const handleLogoutClick = () => {
        setIsOpen(false);
        setShowLogoutConfirm(true);
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-teal-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-100 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-teal-200 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-teal-200 rounded-full" />
            <div className="absolute top-5 right-5 w-16 h-16 rounded-full">
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-center gap-2">
                            <Button className="rounded-full w-10 h-10 p-0 bg-teal-700 hover:bg-teal-500">
                                <Avatar>
                                    <AvatarImage src={user?.profile} />
                                    <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            onClick={handleSettingsClick}
                        >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
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
            <div className="z-10 text-center space-y-8 w-full max-w-md">
                <h1 className="max-sm:text-2xl md:text-3xl font-bold text-teal-700">Hello, {user?.username}</h1>
                <p className="text-gray-600">What would you like to do today?</p>

                <div className="space-y-6 w-full max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button
                            onClick={() => navigate('/appointment')}
                            className="w-full py-6 text-lg flex items-center justify-center gap-3 bg-teal-500 hover:bg-teal-600 text-white"
                        >
                            <Calendar className="w-6 h-6" />
                            My Appointment
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Button
                            onClick={() => navigate('/reminders')}
                            className="w-full py-6 text-lg flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <Clock className="w-6 h-6" />
                            My Medicine Reminder
                        </Button>
                    </motion.div>

                    <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                        <AlertDialogTrigger asChild>
                            <div className="flex items-center justify-center gap-1 text-teal-500 hover:text-teal-600 cursor-pointer hover:underline">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You will be signed out of your account and redirected to the login page. You can log
                                    in again anytime.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-teal-500 hover:bg-teal-600" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-2" /> Yes, Logout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </main>
    );
}

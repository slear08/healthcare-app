import { Eye, EyeOff, Heart, Lock, Mail } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useAdminLogin } from '@/api/admin/mutations/login.mutation';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

interface LoginFormValues {
    email: string;
    password: string;
}

export function LoginAdmin() {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const { mutateAsync: login, isPending } = useAdminLogin();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: LoginFormValues) {
        try {
            await toast.promise(login(values), {
                loading: 'Signing in...',
                success: (data) => {
                    navigate('/');
                    return `Welcome back, ${data.user.name}!`;
                },
                error: 'Invalid email or password',
            });
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    // If authenticated, don't render the form
    if (isAuthenticated && user) {
        return null;
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="mx-auto max-w-[450px] p-6 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col space-y-2 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-teal-100 p-3">
                            <Heart className="h-8 w-8 text-teal-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-teal-800">Welcome back</h1>
                    <p className="text-sm text-slate-500">Enter your credentials to access the admin dashboard</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Email</FormLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <FormControl>
                                                <Input
                                                    placeholder="name@example.com"
                                                    type="email"
                                                    autoCapitalize="none"
                                                    autoComplete="email"
                                                    autoCorrect="off"
                                                    disabled={isPending}
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-slate-700">Password</FormLabel>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    autoCapitalize="none"
                                                    autoComplete="current-password"
                                                    disabled={isPending}
                                                    className="pl-10 pr-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isPending}
                                className={cn(
                                    'w-full bg-teal-600 hover:bg-teal-700 text-white',
                                    isPending && 'opacity-70 cursor-not-allowed'
                                )}
                            >
                                {isPending ? 'Signing in...' : 'Sign in'}
                            </Button>
                            <div className="flex justify-end">
                                <a
                                    href="https://www.facebook.com/Aves.jhonel"
                                    target="_blank"
                                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                                >
                                    Contact the developer?
                                </a>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}

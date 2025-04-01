import { motion } from 'framer-motion';
import { ArrowRight, CircleChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useVerifyUser } from '@/api/users/mutations/verify_user.mutation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth';
import { zodResolver } from '@hookform/resolvers/zod';

const userSetupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    mobileNumber: z
        .string()
        .min(1, 'Mobile number is required')
        .refine((val) => {
            const digits = val.replace(/\D/g, '');
            return /^(\+63|09)\d{9}$/.test(val) || /^63\d{9}$/.test(digits) || /^\+63\d{10}$/.test(val);
        }, 'Please enter a valid Philippine mobile number (+63 format)')
        .transform((val) => {
            const digits = val.replace(/\D/g, '');
            if (digits.startsWith('09')) {
                return '+63' + digits.slice(1);
            } else if (digits.startsWith('63')) {
                return '+' + digits;
            }
            return val;
        }),
});

type UserSetupForm = z.infer<typeof userSetupSchema>;

export default function UserSetup() {
    const location = useLocation();
    const navigate = useNavigate();
    const isProfileEdit = location.pathname === '/profile-edit';
    const { mutateAsync: verifyUser } = useVerifyUser();

    const { user, login } = useAuthStore();

    const form = useForm<UserSetupForm>({
        resolver: zodResolver(userSetupSchema),
        defaultValues: {
            name: user?.username || '',
            mobileNumber: user?.mobileNumber || '',
        },
    });

    const onSubmit = async (data: UserSetupForm) => {
        try {
            await toast.promise(verifyUser(data), {
                loading: isProfileEdit ? 'Updating your profile...' : 'Verifying your details...',
                success: (response) => {
                    // Update the auth store with new user data
                    login(data.name, user?.role || 'USER', user?.profile, data.mobileNumber);

                    if (isProfileEdit) {
                        navigate(-1);
                        return 'Profile updated successfully';
                    } else {
                        window.location.reload();
                        return response.message;
                    }
                },
                error: isProfileEdit ? 'Failed to update profile' : 'Failed to verify your details',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleBackButton = () => {
        navigate(-1);
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-teal-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-100 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-teal-200 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-teal-200 rounded-full" />

            <div className="z-10 text-center space-y-8 w-full max-w-md">
                <h1 className="max-sm:text-2xl md:text-3xl font-bold text-teal-700">
                    {isProfileEdit ? 'Edit Your Profile' : 'Welcome to Senior Check'}
                </h1>
                <p className="text-gray-600">
                    {isProfileEdit ? 'Update your profile information below.' : 'Please complete your profile setup.'}
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-2"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Enter your full name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-2"
                        >
                            <FormField
                                control={form.control}
                                name="mobileNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter mobile number (+63 format)"
                                                type="tel"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Allow only digits, +, and spaces
                                                    if (/^[\d+\s]*$/.test(value)) {
                                                        field.onChange(value);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <div className="flex justify-end pt-4 gap-2">
                            {isProfileEdit && (
                                <Button
                                    className="md:mr-5 mb-5"
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={handleBackButton}
                                >
                                    <CircleChevronLeft />
                                    Back
                                </Button>
                            )}
                            <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700">
                                <ArrowRight className="w-4 h-4" />
                                {isProfileEdit ? 'Save Changes' : 'Complete Setup'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}

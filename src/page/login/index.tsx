import { Heart } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    if (isAuthenticated && user) {
        return null;
    }

    const handleLoginButton = () => {
        window.open('http://localhost:5000/api/auth/google', '_self');
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-teal-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-100 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-teal-200 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-teal-200 rounded-full" />

            <div className="z-10">
                <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center animate-pulse">
                            <Heart className="w-8 h-8 text-teal-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-teal-700">Senior Check App</CardTitle>
                        <CardDescription className="text-gray-600">Your Secure Healthcare Portal</CardDescription>
                        <CardDescription className="text-gray-600">Brgy. Kalawaan Pasig, City</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-sm text-gray-500">
                            Access your health records, appointments, and more with a single sign-on.
                        </p>
                        <Button
                            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
                            onClick={handleLoginButton}
                        >
                            Sign in with Google
                        </Button>
                        <p className="text-center text-xs text-gray-400">
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

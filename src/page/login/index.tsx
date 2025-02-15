import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
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
                        <Button className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#ffffff"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#ffffff"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#ffffff"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#ffffff"
                                />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
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

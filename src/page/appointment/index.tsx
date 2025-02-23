import { Activity, CalendarDays, CircleChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppointmentPage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-teal-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-100 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-teal-200 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-teal-200 rounded-full" />

            <div className="container mx-auto p-4 max-w-2xl z-10 ">
                <div className="flex justify-between items-center mb-4 ">
                    <Button className="md:mr-5 bg-teal-500 hover:bg-teal-600" size="sm">
                        <CircleChevronLeft />
                        Back
                    </Button>
                </div>
                <Card className="w-full bg-teal-50">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-center text-teal-700">Active Appointment</h1>
                        <CardTitle className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1 mb-2 text-teal-700">
                                    <CalendarDays className="w-5 h-5 text-gray-500" />
                                    <span className="font-semibold">February 16, 2025</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2 text-teal-700">
                                    <Activity className="w-5 h-5 text-gray-500" />
                                    <span>Medical Checkup</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-sm font-normal">Waiting</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-teal-600">Queue Information</p>
                            <p className="text-teal-600">Total in queue: 15</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-teal-600">You are in position</p>
                            <p className="text-8xl font-bold mb-2 text-teal-700">3</p>

                            <Button variant="destructive" size="sm">
                                Cancel Appointment
                            </Button>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg text-center">
                            <p className="font-semibold text-yellow-800 max-sm:text-sm">
                                Please arrive before your turn reaches the front to avoid missing your appointment.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

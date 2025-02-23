import { motion } from 'framer-motion';
import { Activity, CalendarDays, History } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function AppointmentHistory() {
    const appointmentHistory = [
        { date: 'January 15, 2024', purpose: 'General Checkup', status: 'Completed' },
        { date: 'October 22, 2023', purpose: 'Flu Vaccination', status: 'Completed' },
        { date: 'July 03, 2023', purpose: 'Physical Therapy', status: 'Cancelled' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'text-green-500';
            case 'Cancelled':
                return 'text-red-500';
            case 'Pending':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <>
            <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" className="bg-white">
                        <History />
                        History
                    </Button>
                </motion.div>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto max-h-screen">
                <SheetHeader>
                    <SheetTitle>Appointment History</SheetTitle>
                </SheetHeader>
                <motion.div
                    className="mt-4 space-y-4 max-h-[calc(100vh-8rem)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {appointmentHistory.map((appointment, index) => (
                        <motion.div
                            key={index}
                            className="border-b pb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <div className="flex items-center gap-1 mb-2 text-teal-700">
                                <CalendarDays className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2 text-teal-700">
                                <Activity className="w-4 h-4 text-gray-500" />
                                <span>{appointment.purpose}</span>
                            </div>
                            <span className={`text-sm ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </SheetContent>
        </>
    );
}

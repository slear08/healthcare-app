import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Activity, CalendarDays, History } from 'lucide-react';

import { useQueueHistory } from '@/api/users/queries/get_queue_history.query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function AppointmentHistory() {
    const { data } = useQueueHistory();

    const appointmentHistory = data?.data;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-progress':
                return 'bg-green-500';
            case 'cancelled':
                return 'bg-red-500';
            case 'waiting':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
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
                    {appointmentHistory?.map((appointment, index) => (
                        <motion.div
                            key={index}
                            className="border-b pb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 mb-2 text-teal-700">
                                    <CalendarDays className="w-4 h-4 text-gray-500" />
                                    <span className="font-semibold">
                                        {format(new Date(appointment.timeSchedule), 'MMM. dd yyyy')}
                                    </span>
                                </div>
                                <Badge className={`${getStatusColor(appointment.status)}`}>{appointment.status}</Badge>
                            </div>
                            <div className="flex items-center gap-1 mb-2 text-teal-700">
                                <Activity className="w-4 h-4 text-gray-500" />
                                <span>{appointment.purpose.toUpperCase()}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </SheetContent>
        </>
    );
}

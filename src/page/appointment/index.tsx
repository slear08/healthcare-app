import { AnimatePresence, motion } from 'framer-motion';
import { CircleChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';

import ActiveAppointment from './component/active_appointment.component';
import AppointmentHistory from './component/appointment_history.component';
import NoActiveAppointment from './component/no_active_appointment.component';

export default function AppointmentPage() {
    const navigate = useNavigate();

    const [hasActiveAppointment, setActiveAppointment] = useState(false);

    const handleBackButton = () => {
        navigate(-1);
    };
    const handleBookAppointmentButton = () => {
        setActiveAppointment(!hasActiveAppointment);
    };

    return (
        <motion.main
            className="flex min-h-screen items-center justify-center p-4 bg-teal-50 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full -translate-x-1/2 -translate-y-1/2"
                animate={{
                    scale: [1, 1.1, 1],
                    transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' },
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-48 h-48 bg-teal-100 rounded-full translate-x-1/3 translate-y-1/3"
                animate={{
                    scale: [1, 1.1, 1],
                    transition: { duration: 6, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' },
                }}
            />
            <motion.div
                className="absolute top-1/4 right-1/4 w-16 h-16 bg-teal-200 rounded-full"
                animate={{
                    y: [0, -10, 0],
                    transition: { duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' },
                }}
            />
            <motion.div
                className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-teal-200 rounded-full"
                animate={{
                    y: [0, 10, 0],
                    transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' },
                }}
            />

            <div className="container mx-auto p-4 max-w-2xl z-10">
                <motion.div
                    className="flex justify-between items-center mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="md:mr-5 bg-teal-500 hover:bg-teal-600" size="sm" onClick={handleBackButton}>
                            <CircleChevronLeft />
                            Back
                        </Button>
                    </motion.div>
                    <Sheet>
                        <AppointmentHistory />
                    </Sheet>
                </motion.div>
                <AnimatePresence mode="wait">
                    {hasActiveAppointment ? (
                        <ActiveAppointment key="active" handleBookAppointmentButton={handleBookAppointmentButton} />
                    ) : (
                        <NoActiveAppointment key="inactive" handleBookAppointmentButton={handleBookAppointmentButton} />
                    )}
                </AnimatePresence>
            </div>
        </motion.main>
    );
}

import { motion } from 'framer-motion';
import { CalendarPlus, CalendarX2, Check, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function NoActiveAppointment({
    handleBookAppointmentButton,
}: {
    handleBookAppointmentButton: () => void;
}) {
    return (
        <Card className="w-full bg-teal-50">
            <CardHeader>
                <motion.h1
                    className="text-2xl font-bold text-center text-teal-700"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    No Active Appointment
                </motion.h1>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                    <motion.div
                        className="mb-6 flex flex-col items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <CalendarX2 className="w-20 h-20 text-teal-300 mb-4" />
                        <p className="text-lg text-teal-600">You currently have no active appointments</p>
                    </motion.div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-teal-500 hover:bg-teal-600" size="sm">
                                <Plus className="mr-1 w-4 h-4" />
                                Book Appointment
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <motion.div
                                    className="flex items-center justify-center mb-4"
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CalendarPlus className="w-12 h-12 text-teal-500" />
                                </motion.div>
                                <DialogTitle className="text-center text-xl">Confirm Booking</DialogTitle>
                                <DialogDescription className="text-center">
                                    <motion.span
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        Are you sure you want to book a new appointment?
                                    </motion.span>
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="md:flex gap-2 justify-center mt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" size="sm">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    className="bg-teal-500 hover:bg-teal-600"
                                    size="sm"
                                    onClick={handleBookAppointmentButton}
                                >
                                    <Check className="w-4 h-4" />
                                    Confirm Booking
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}

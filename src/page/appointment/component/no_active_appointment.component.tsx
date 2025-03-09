import { motion } from 'framer-motion';
import { CalendarPlus, CalendarX2, Check, Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useCreateQueue } from '@/api/users/mutations/create_queue.mutation';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function NoActiveAppointment() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [appointmentPurpose, setAppointmentPurpose] = useState<string>('checkup');
    const { mutateAsync } = useCreateQueue();

    const handleCreateAppointment = () => {
        toast.promise(mutateAsync({ purpose: appointmentPurpose }), {
            loading: 'Saving appointment',
            success: <b>Appointment Successfully Saved</b>,
            error: <b>Oh no! The appointment system is closed. Please try again later. Thank you</b>,
        });
        setDialogOpen(false);
    };

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
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                                <DialogTitle className="text-center text-xl">Confirm Appointment</DialogTitle>
                                <DialogDescription className="text-center">
                                    <motion.span
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        Please select the purpose of your appointment
                                    </motion.span>
                                </DialogDescription>
                            </DialogHeader>

                            <motion.div
                                className="mt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <RadioGroup
                                    value={appointmentPurpose}
                                    onValueChange={setAppointmentPurpose}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center space-x-2 rounded-md border p-3 border-teal-200 bg-teal-50/50">
                                        <RadioGroupItem
                                            value="medicine-request"
                                            id="medicine-request"
                                            className="border-teal-400 text-teal-500 focus:ring-teal-400 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white"
                                        />
                                        <Label
                                            htmlFor="medicine-request"
                                            className="flex-1 cursor-pointer font-medium text-teal-700"
                                        >
                                            Medicine Request
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md border p-3 border-teal-200 bg-teal-50/50">
                                        <RadioGroupItem
                                            value="checkup"
                                            id="checkup"
                                            className="border-teal-400 text-teal-500 focus:ring-teal-400 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white"
                                        />
                                        <Label
                                            htmlFor="checkup"
                                            className="flex-1 cursor-pointer font-medium text-teal-700"
                                        >
                                            Checkup
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </motion.div>

                            <DialogFooter className="md:flex gap-2 justify-center mt-6">
                                <DialogClose asChild>
                                    <Button variant="outline" size="sm">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    className="bg-teal-500 hover:bg-teal-600"
                                    size="sm"
                                    onClick={handleCreateAppointment}
                                >
                                    <Check className="w-4 h-4 mr-1" />
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

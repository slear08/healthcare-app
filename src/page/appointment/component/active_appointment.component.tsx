import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Activity, CalendarDays, CalendarX2, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useCancelQueue } from '@/api/users/mutations/cancel_queue.mutation';
import { useActiveQueue } from '@/api/users/queries/get_active_queue.query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useSocket } from '@/hooks/useSocket';

interface QueueUpdateData {
    queueId: string;
    userId: string;
    status: 'waiting' | 'in-progress' | 'completed';
    updatedQueue: {
        _id: string;
        status: string;
        purpose: string;
        timeSchedule: string;
        userId: string;
    };
}

export default function ActiveAppointment() {
    const { data, refetch } = useActiveQueue();
    const { mutateAsync } = useCancelQueue();
    const [dialogOpen, setDialogOpen] = useState(false);
    const socket = useSocket();

    // Listen for queue status updates
    useEffect(() => {
        if (!socket) return;

        const handleQueueStatusUpdate = (updateData: QueueUpdateData) => {
            // Check if this update is for the current user's queue
            if (data?.data?.userQueue?.[0]?._id === updateData.queueId) {
                // Show toast notification
                toast.success(`Your appointment status has been updated to ${updateData.status}`);

                // Refetch the active queue data
                refetch();
            }
        };

        // Listen for queue status updates
        socket.on('queueStatusUpdate', handleQueueStatusUpdate);

        // Cleanup listener on unmount
        return () => {
            socket.off('queueStatusUpdate', handleQueueStatusUpdate);
        };
    }, [socket, data?.data?.userQueue?.[0]?._id, refetch]);

    const handleCancelAppointmentButton = () => {
        toast.promise(mutateAsync(data?.data?.userQueue?.[0]?._id as string), {
            loading: 'Loading...',
            success: <b>Appointment Successfully Cancelled</b>,
            error: <b>Something Went Wrong</b>,
        });
        setDialogOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full bg-teal-50">
                <CardHeader>
                    <motion.h1
                        className="text-2xl font-bold text-center text-teal-700"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Active Appointment
                    </motion.h1>
                    <CardTitle className="flex items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="flex items-center gap-1 mb-2 text-teal-700">
                                <CalendarDays className="w-5 h-5 text-gray-500" />
                                <span className="font-semibold">
                                    {data?.data?.userQueue?.[0]?.timeSchedule
                                        ? format(new Date(data.data.userQueue[0].timeSchedule), 'MMM. dd yyyy')
                                        : 'No Scheduled Time'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 mb-2 text-teal-700">
                                <Activity className="w-5 h-5 text-gray-500" />
                                <span>{data?.data?.userQueue?.[0]?.purpose.toLocaleUpperCase()}</span>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex items-center"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div
                                className={`w-3 h-3 ${
                                    data?.data?.userQueue?.[0]?.status.toLowerCase() === 'waiting'
                                        ? 'bg-blue-500'
                                        : data?.data?.userQueue?.[0]?.status.toLowerCase() === 'in-progress'
                                        ? 'bg-yellow-500'
                                        : 'bg-teal-500'
                                }  rounded-full mr-2 animate-pulse`}
                            ></div>
                            <span className="text-sm font-normal">
                                {data?.data?.userQueue?.[0]?.status.toLowerCase()}
                            </span>
                        </motion.div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <p className="text-lg font-semibold text-teal-600">Queue Information</p>
                        <p className="text-teal-600">Total in queue: {data?.data?.totalWaiting}</p>
                    </motion.div>
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <p className="font-semibold text-teal-600">You are in position</p>
                        <motion.p
                            className="text-8xl font-bold mb-2 text-teal-700"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            {data?.data?.position}
                        </motion.p>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    {(data?.data?.position as number) === 1 ||
                                    data?.data?.userQueue?.[0]?.status.toLowerCase() === 'in-progress' ? (
                                        ''
                                    ) : (
                                        <Button variant="destructive" size="sm">
                                            Cancel Appointment
                                        </Button>
                                    )}
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <motion.div
                                            className="flex items-center justify-center mb-4"
                                            initial={{ rotate: -180, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <CalendarX2 className="w-12 h-12 text-teal-500" />
                                        </motion.div>
                                        <DialogTitle className="text-center text-xl">
                                            Confirm Cancel Appointment
                                        </DialogTitle>
                                        <DialogDescription className="text-center">
                                            <motion.span
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            >
                                                Are you sure you want to cancel this appointment?
                                                <br />
                                                This action cannot be undone.
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
                                            onClick={handleCancelAppointmentButton}
                                        >
                                            <Check className="w-4 h-4" />
                                            Yes, I am sure.
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="bg-yellow-100 p-4 rounded-lg text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <p className="font-semibold text-yellow-800 max-sm:text-sm">
                            Please arrive before your turn reaches the front to avoid missing your appointment.
                        </p>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

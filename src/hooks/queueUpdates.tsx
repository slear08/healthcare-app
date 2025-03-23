import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useActiveQueue } from '@/api/users/queries/get_active_queue.query';

import { useSocket } from './useSocket';

interface QueueUpdateData {
    queueId: string;
    userId: string;
    status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
    updatedQueue: {
        _id: string;
        status: string;
        purpose: string;
        timeSchedule: string;
        userId: string;
    };
}
export default function QueueUpdates({ children }: { children: React.ReactNode }) {
    const socket = useSocket();
    const { data, refetch } = useActiveQueue();

    useEffect(() => {
        if (!socket) {
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        const queueId = data?.data?.userQueue?.[0]?._id;

        if (!queueId) {
            return;
        }

        const handleQueueStatusUpdate = (updateData: QueueUpdateData) => {
            if (queueId === updateData.queueId) {
                toast.success(`Your appointment status has been updated to ${updateData.status}`);
                refetch();
            }
        };

        socket.on('queueStatusUpdate', handleQueueStatusUpdate);

        return () => {
            console.log('Cleaning up queueStatusUpdate listener');
            socket.off('queueStatusUpdate', handleQueueStatusUpdate);
        };
    }, [socket, data?.data?.userQueue?.[0]?._id, refetch]);

    return children;
}

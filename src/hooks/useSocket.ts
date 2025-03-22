import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io('http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });

        // Add connection event handlers
        socketRef.current.on('connect', () => {
            console.log('Socket connected');
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            toast.error('Failed to connect to real-time updates');
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return socketRef.current;
};

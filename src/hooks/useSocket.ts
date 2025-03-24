import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!socketRef.current) {
            console.log('Initializing socket connection');
            socketRef.current = io('http://localhost:5000', {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
            });
        }

        const socket = socketRef.current;

        function onConnect() {
            console.log('Socket connected successfully');
            setIsConnected(true);
        }

        function onDisconnect() {
            console.log('Socket disconnected');
            setIsConnected(false);
        }

        function onConnectError(error: Error) {
            console.error('Socket connection error:', error);
            toast.error('Failed to connect to real-time updates');
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);

        setIsConnected(socket.connected);

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
        };
    }, []);

    useEffect(() => {
        console.log('Socket connection state:', isConnected ? 'connected' : 'disconnected');
    }, [isConnected]);

    return socketRef.current;
};

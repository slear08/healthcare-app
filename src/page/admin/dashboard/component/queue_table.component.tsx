import { Activity, AlertCircle, CheckCircle, Loader2, User } from 'lucide-react';
import { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import QueueSettings from './queue_settings.component';

type QueueItem = {
    id: string;
    user: string;
    purpose: string;
    status: 'waiting' | 'processing' | 'complete';
};

const initialQueue: QueueItem[] = [
    { id: '1', user: 'John Doe', purpose: 'Checkup', status: 'waiting' },
    { id: '2', user: 'Jane Smith', purpose: 'Medicine Request', status: 'processing' },
    { id: '3', user: 'Bob Johnson', purpose: 'Medicine Request', status: 'waiting' },
    { id: '4', user: 'Alice Brown', purpose: 'Checkup', status: 'complete' },
    { id: '5', user: 'Charlie Wilson', purpose: 'Medicine Request', status: 'waiting' },
];

export function QueueTable() {
    const [queue, setQueue] = useState<QueueItem[]>(initialQueue);

    const handleStatusChange = (id: string, newStatus: QueueItem['status']) => {
        setQueue(queue.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    };

    const getStatusIcon = (status: QueueItem['status']) => {
        switch (status) {
            case 'waiting':
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
            case 'processing':
                return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
            case 'complete':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
    };

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-4 text-teal-700">Queue Management</h2>
                <QueueSettings />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {queue.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span>{item.user}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Activity className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span>{item.purpose}</span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center">
                                    {getStatusIcon(item.status)}
                                    <Select
                                        value={item.status}
                                        onValueChange={(value) =>
                                            handleStatusChange(item.id, value as QueueItem['status'])
                                        }
                                    >
                                        <SelectTrigger className="w-[180px] ml-2">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="waiting">Waiting</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="complete">Complete</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

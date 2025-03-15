import debounce from 'lodash/debounce';
import { Activity, AlertCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useUpdateQueueStatus } from '@/api/admin/mutations/update_user_queue_status.mutation';
import { useQueueList } from '@/api/admin/queries/get_queue_list.query';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import QueueSettings from './queue_settings.component';

type QueueStatus = 'waiting' | 'in-progress' | 'completed' | 'cancelled';

const STATUS_OPTIONS: { value: QueueStatus; label: string }[] = [
    { value: 'waiting', label: 'Waiting' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

type QueueItem = {
    _id: string;
    status: QueueStatus;
    purpose: string;
    timeSchedule: string;
    user: {
        _id: string;
        name: string;
        profile: string;
        email: string;
    };
};

const getNextPossibleStatuses = (currentStatus: QueueStatus): QueueStatus[] => {
    switch (currentStatus) {
        case 'waiting':
            return ['in-progress', 'cancelled'];
        case 'in-progress':
            return ['completed', 'cancelled'];
        case 'completed':
        case 'cancelled':
            return [];
        default:
            return [];
    }
};

export function QueueTable() {
    const updateQueueStatus = useUpdateQueueStatus();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [purposeFilter, setPurposeFilter] = useState<string>('all');

    const { data, isLoading, isError } = useQueueList({
        page: currentPage,
        status: statusFilter === 'all' ? undefined : (statusFilter as QueueStatus),
        search: debouncedSearchTerm,
        purpose: purposeFilter === 'all' ? undefined : purposeFilter,
    });

    const [statusChangeDialog, setStatusChangeDialog] = useState<{
        isOpen: boolean;
        itemId: string;
        userId: string;
        currentStatus: QueueStatus;
        newStatus: QueueStatus;
    }>({
        isOpen: false,
        itemId: '',
        userId: '',
        currentStatus: 'waiting',
        newStatus: 'waiting',
    });

    // Debounce search term updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 300),
        []
    );

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSetSearch(value);
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, statusFilter, purposeFilter]);

    const handleStatusChangeConfirm = async () => {
        try {
            await updateQueueStatus.mutateAsync({
                userId: statusChangeDialog.userId,
                queueId: statusChangeDialog.itemId,
                status: statusChangeDialog.newStatus,
            });

            // Show success toast
            toast.success(
                `Queue status has been changed to ${
                    STATUS_OPTIONS.find((opt) => opt.value === statusChangeDialog.newStatus)?.label
                }`
            );

            setStatusChangeDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
            // Show error toast
            toast.error('Failed to update queue status. Please try again.');
            console.error('Error updating queue status:', error);
        }
    };

    const goToNextPage = () => {
        if (data?.pagination.hasNextPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (data?.pagination.hasPreviousPage) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const getStatusBadge = (status: QueueStatus) => {
        const statusConfig: Record<QueueStatus, { bgColor: string; textColor: string; borderColor: string }> = {
            waiting: { bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
            'in-progress': { bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
            completed: { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
            cancelled: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
        };

        const config = statusConfig[status];
        return (
            <Badge variant="outline" className={`${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                {STATUS_OPTIONS.find((opt) => opt.value === status)?.label || 'Unknown'}
            </Badge>
        );
    };

    const formatPurpose = (purpose: string) => {
        return purpose
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderStatusSelect = (item: QueueItem) => {
        const nextPossibleStatuses = getNextPossibleStatuses(item.status);
        const currentStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === item.status)?.label;

        if (nextPossibleStatuses.length === 0) {
            return <div className="text-sm text-muted-foreground italic px-2">Status: {currentStatusLabel}</div>;
        }

        return (
            <Select
                value={item.status}
                onValueChange={(value: QueueStatus) => {
                    setStatusChangeDialog({
                        isOpen: true,
                        itemId: item._id,
                        userId: item.user._id,
                        currentStatus: item.status,
                        newStatus: value,
                    });
                }}
            >
                <SelectTrigger className="w-[140px] ml-auto">
                    <SelectValue>{currentStatusLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={item.status}>{currentStatusLabel}</SelectItem>
                    {STATUS_OPTIONS.filter((option) => nextPossibleStatuses.includes(option.value)).map(
                        (option) =>
                            option.value !== item.status && (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            )
                    )}
                </SelectContent>
            </Select>
        );
    };

    const renderTableBody = () => {
        if (isLoading) {
            return Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                    <TableCell className="h-[69px]">
                        <div className="h-2 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-2 w-[120px] bg-muted animate-pulse rounded" />
                                <div className="h-2 w-[150px] bg-muted animate-pulse rounded" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="h-2 w-[100px] bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                        <div className="h-2 w-[120px] bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                        <div className="h-5 w-[80px] bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                        <div className="h-9 w-[140px] bg-muted animate-pulse rounded ml-auto" />
                    </TableCell>
                </TableRow>
            ));
        }

        const queueItems = data?.queueList || [];

        if (queueItems.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="h-[400px] text-center text-muted-foreground">
                        No Data
                    </TableCell>
                </TableRow>
            );
        }

        const rows = [];
        const emptyRows = Math.max(10 - queueItems.length, 0);

        // Add existing items
        for (const item of queueItems) {
            rows.push(
                <TableRow key={item._id}>
                    <TableCell className="font-mono text-xs">{item._id.split('_')[1]}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={item.user.profile} alt={item.user.name} />
                                <AvatarFallback>
                                    {item.user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{item.user.name}</div>
                                <div className="text-xs text-muted-foreground">{item.user.email}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-2 flex-shrink-0 text-teal-600" />
                            <span>{formatPurpose(item.purpose)}</span>
                        </div>
                    </TableCell>
                    <TableCell>{formatDate(item.timeSchedule)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">{renderStatusSelect(item)}</TableCell>
                </TableRow>
            );
        }

        // Add empty rows to maintain consistent height
        for (let i = 0; i < emptyRows; i++) {
            rows.push(
                <TableRow key={`empty-${i}`}>
                    <TableCell className="h-[40px]">&nbsp;</TableCell>
                    <TableCell className="h-[40px]">&nbsp;</TableCell>
                    <TableCell className="h-[40px]">&nbsp;</TableCell>
                    <TableCell className="h-[40px]">&nbsp;</TableCell>
                    <TableCell className="h-[40px]">&nbsp;</TableCell>
                    <TableCell className="h-[40px]">&nbsp;</TableCell>
                </TableRow>
            );
        }

        return rows;
    };

    if (isError) {
        return (
            <div className="flex justify-center items-center h-64">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <span className="ml-2 text-red-700">Error loading queue data</span>
            </div>
        );
    }

    return (
        <Card className="shadow-sm">
            <AlertDialog
                open={statusChangeDialog.isOpen}
                onOpenChange={(isOpen) => setStatusChangeDialog((prev) => ({ ...prev, isOpen }))}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Queue Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change the status from{' '}
                            <span className="font-medium">
                                {STATUS_OPTIONS.find((opt) => opt.value === statusChangeDialog.currentStatus)?.label}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                                {STATUS_OPTIONS.find((opt) => opt.value === statusChangeDialog.newStatus)?.label}
                            </span>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleStatusChangeConfirm}>Confirm Change</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-teal-700">Queue Management</CardTitle>
                    <QueueSettings />
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, email or ID..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="waiting">Waiting</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Purpose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Purposes</SelectItem>
                                    <SelectItem value="checkup">Checkup</SelectItem>
                                    <SelectItem value="medicine-request">Medicine Request</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {data?.pagination && (
                        <div className="text-sm text-muted-foreground">
                            Showing {(data.pagination.currentPage - 1) * data.pagination.itemsPerPage + 1} to{' '}
                            {Math.min(
                                data.pagination.currentPage * data.pagination.itemsPerPage,
                                data.pagination.totalItems
                            )}{' '}
                            of {data.pagination.totalItems} entries
                        </div>
                    )}
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Queue ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Schedule Created</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{renderTableBody()}</TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        {data?.pagination && (
                            <>
                                Page {data.pagination.currentPage} of {data.pagination.totalPages} (
                                {data.pagination.totalItems} total entries)
                            </>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPreviousPage}
                            disabled={!data?.pagination.hasPreviousPage || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous Page</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextPage}
                            disabled={!data?.pagination.hasNextPage || isLoading}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next Page</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

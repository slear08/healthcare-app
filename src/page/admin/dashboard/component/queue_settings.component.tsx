import { AxiosError } from 'axios';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { useUpdateQueueLimit } from '@/api/admin/mutations/update_queue_limit.mutation';
import { useQueueLimit } from '@/api/admin/queries/get_queue_limit.query';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';

interface ErrorResponse {
    message: string;
}

const formSchema = z.object({
    queueEnabled: z.boolean(),
    queueLimit: z.coerce.number().int().positive().min(1, {
        message: 'Queue limit must be at least 1',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function QueueSettings() {
    const [open, setOpen] = useState(false);
    const { data: queueSettings, isLoading } = useQueueLimit();
    const { mutateAsync: updateQueueLimit, isPending } = useUpdateQueueLimit();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (queueSettings) {
            form.reset({
                queueEnabled: queueSettings.status === 'ON',
                queueLimit: queueSettings.limit,
            });
        }
    }, [queueSettings, form]);

    async function onSubmit(values: FormValues) {
        try {
            await toast.promise(
                updateQueueLimit({
                    status: values.queueEnabled ? 'ON' : 'OFF',
                    limit: values.queueLimit,
                }),
                {
                    loading: 'Updating queue settings...',
                    success: 'Queue settings updated successfully',
                    error: (err: AxiosError<ErrorResponse>) => {
                        const message = err.response?.data?.message || 'Failed to update queue settings';
                        return message;
                    },
                }
            );
            setOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Failed to update queue settings:', error.response?.data?.message);
            } else {
                console.error('Failed to update queue settings:', error);
            }
        }
    }

    if (isLoading) {
        return (
            <Button disabled className="bg-teal-700" size="icon">
                <Settings className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-teal-700 hover:bg-teal-500" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Queue Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                        Configure your queue settings. Changes will be applied when you save.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="queueEnabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Queue Status</FormLabel>
                                        <FormDescription>Enable or disable the queue</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            className="data-[state=checked]:bg-teal-700 data-[state=checked]:hover:bg-teal-500"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="queueLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Queue Limit</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} disabled={!form.watch('queueEnabled')} />
                                    </FormControl>
                                    <FormDescription>Maximum number of items allowed in the queue</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-4 pt-2">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button className="bg-teal-700 hover:bg-teal-500" type="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

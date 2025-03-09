import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

// Define the form schema with zod
const formSchema = z.object({
    queueEnabled: z.boolean().default(true),
    queueLimit: z.coerce
        .number()
        .int()
        .positive()
        .min(1, {
            message: 'Queue limit must be at least 1',
        })
        .default(50),
});

type FormValues = z.infer<typeof formSchema>;

export default function QueueSettings() {
    const [open, setOpen] = useState(false);

    // Initialize the form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            queueEnabled: true,
            queueLimit: 50,
        },
    });

    // Handle form submission
    function onSubmit(values: FormValues) {
        console.log('Queue settings updated:', values);
        setOpen(false);
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
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-teal-700 hover:bg-teal-500" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

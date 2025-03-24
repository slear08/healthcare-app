import { CircleChevronLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useCreateMedicineReminder } from '@/api/users/mutations/create_medicine_reminder.mutation';
import { useDeleteMedicineReminder } from '@/api/users/mutations/delete_reminder.mutation';
import { useUpdateMedicineReminder } from '@/api/users/mutations/update_reminder.mutation';
import { useMedicineReminders } from '@/api/users/queries/get_reminder_list.query';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { useQueryClient } from '@tanstack/react-query';

import ReminderList from './component/reminder_list.component';
import ReminderModal from './component/reminder_modal.component';

export type Reminder = {
    _id: string | undefined;
    name: string;
    numberToTake: number;
    isEveryday: boolean;
    time: string;
    reminderDate?: string;
};
export default function ReminderPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // ✅ Fetch reminders from API
    const { data, isLoading } = useMedicineReminders();
    const { mutateAsync: createReminder } = useCreateMedicineReminder();
    const { mutateAsync: deleteReminder } = useDeleteMedicineReminder();
    const { mutateAsync: updateReminder } = useUpdateMedicineReminder();

    const handleBackButton = () => {
        navigate(-1);
    };

    const handleAddReminder = async (reminder: Omit<Reminder, 'id'>) => {
        try {
            await toast.promise(createReminder(reminder), {
                loading: 'Saving reminder...',
                success: <b>Reminder Successfully Saved</b>,
                error: <b>Reminder is already exist</b>,
            });

            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['medicineReminders'] });
        } catch (error) {
            console.error('Error creating reminder:', error);
        }
    };

    const handleEditReminder = async (reminder: Reminder) => {
        try {
            await toast.promise(updateReminder({ reminderId: reminder._id!, ...reminder }), {
                loading: 'Updating reminder...',
                success: <b>Reminder Successfully Updated</b>,
                error: <b>Reminder is already exist</b>,
            });

            setIsModalOpen(false);
            setEditingReminder(null);
            queryClient.invalidateQueries({ queryKey: ['medicineReminders'] });
        } catch (error) {
            console.error('Error updating reminder:', error);
        }
    };

    // ✅ Handle Delete Reminder
    const handleDeleteReminder = async (id: string) => {
        try {
            await toast.promise(deleteReminder(id), {
                loading: 'Deleting reminder...',
                success: <b>Reminder Successfully Deleted</b>,
                error: <b>Something went wrong</b>,
            });

            queryClient.invalidateQueries({ queryKey: ['medicineReminders'] });
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-teal-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-100 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-teal-200 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-teal-200 rounded-full" />

            <div className="min-h-screen w-screen z-10">
                <div className="max-w-4xl mx-auto p-4">
                    <main className="min-h-screen p-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <Button variant="ghost" onClick={handleBackButton} className="flex items-center">
                                    <CircleChevronLeft className="mr-2 h-5 w-5" />
                                    Back
                                </Button>
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center bg-teal-500 hover:bg-teal-700"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Add Reminder
                                </Button>
                            </div>
                            <ReminderList
                                reminders={data?.data ?? []}
                                onEdit={(reminder) => {
                                    setEditingReminder(reminder);
                                    setIsModalOpen(true);
                                }}
                                onDelete={handleDeleteReminder}
                            />
                        </div>
                        {isModalOpen && (
                            <ReminderModal
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setEditingReminder(null);
                                }}
                                onSave={editingReminder ? handleEditReminder : handleAddReminder}
                                reminder={editingReminder}
                            />
                        )}
                    </main>
                </div>
            </div>
        </main>
    );
}

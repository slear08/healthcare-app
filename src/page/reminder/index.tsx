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

    console.log(data);

    // ✅ Handle Create Reminder
    const handleAddReminder = async (reminder: Omit<Reminder, 'id'>) => {
        try {
            await toast.promise(createReminder(reminder), {
                loading: 'Saving reminder...',
                success: <b>Reminder Successfully Saved</b>,
                error: <b>Reminder is already exist</b>,
            });

            setIsModalOpen(false); // ✅ Close modal after success
            queryClient.invalidateQueries({ queryKey: ['medicineReminders'] }); // ✅ Refetch reminders
        } catch (error) {
            console.error('Error creating reminder:', error);
        }
    };

    // ✅ Handle Update Reminder
    const handleEditReminder = async (reminder: Reminder) => {
        try {
            await toast.promise(
                updateReminder({ reminderId: reminder._id!, ...reminder }), // ✅ Send update request
                {
                    loading: 'Updating reminder...',
                    success: <b>Reminder Successfully Updated</b>,
                    error: <b>Reminder is already exist</b>,
                }
            );

            setIsModalOpen(false); // ✅ Close modal after success
            setEditingReminder(null); // ✅ Clear editing state
            queryClient.invalidateQueries({ queryKey: ['medicineReminders'] }); // ✅ Refetch reminders
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

            queryClient.invalidateQueries({ queryKey: ['medicineReminders'] }); // ✅ Refetch reminders
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    if (isLoading) {
        return <Spinner />; // ✅ Show a spinner while loading
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-teal-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-100 translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-teal-200" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-teal-200" />

            <div className="min-h-screen w-screen z-10">
                <div className="max-w-4xl mx-auto p-4">
                    <main className="min-h-screen p-4">
                        <div className="max-w-4xl mx-auto">
                            <Button
                                className="md:mr-5 mb-5 bg-teal-500 hover:bg-teal-600"
                                size="sm"
                                onClick={handleBackButton}
                            >
                                <CircleChevronLeft />
                                Back
                            </Button>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="max-sm:text-lg text-2xl font-bold text-teal-700">My Reminders</h1>
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-teal-500 hover:bg-teal-600 text-white"
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create New
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

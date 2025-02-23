import { CircleChevronLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import ReminderList from './component/reminder_list.component';
import ReminderModal from './component/reminder_modal.component';

export type Reminder = {
    id: string | undefined;
    name: string;
    numberToTake: number;
    isEveryday: boolean;
    time: string;
    reminderDate?: string;
};

export default function ReminderPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate(-1);
    };

    const handleAddReminder = (reminder: Omit<Reminder, 'id'>) => {
        const newReminder = { ...reminder, id: Date.now().toString() };
        setReminders([...reminders, newReminder]);
        setIsModalOpen(false);
    };

    const handleEditReminder = (reminder: Reminder) => {
        setReminders(reminders.map((r) => (r.id === reminder.id ? reminder : r)));
        setEditingReminder(null);
        setIsModalOpen(false);
    };

    const handleDeleteReminder = (id: string) => {
        setReminders(reminders.filter((r) => r.id !== id));
    };

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
                                reminders={reminders}
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

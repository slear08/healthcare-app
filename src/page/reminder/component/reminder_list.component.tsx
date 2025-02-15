import { AnimatePresence, motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Reminder } from '../';
import EmptyReminderList from './empty_reminder_list.component';

type ReminderListProps = {
    reminders: Reminder[];
    onEdit: (reminder: Reminder) => void;
    onDelete: (id: string) => void;
};

export default function ReminderList({ reminders, onEdit, onDelete }: ReminderListProps) {
    if (reminders.length === 0) {
        return <EmptyReminderList />;
    }

    return (
        <motion.ul className="space-y-4 z-10">
            <AnimatePresence>
                {reminders.map((reminder) => (
                    <motion.li
                        key={reminder.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold text-teal-700">{reminder.name}</h3>
                            <div className="text-xs text-gray-600">
                                <p>
                                    Take {reminder.numberToTake} {reminder.numberToTake > 1 ? 'pills' : 'pill'}
                                </p>
                                <p>
                                    at{' '}
                                    {new Date(`1970-01-01T${reminder.time}`).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </p>
                                <p>
                                    {reminder.isEveryday
                                        ? ' every day'
                                        : reminder.reminderDate
                                        ? ` on ${new Intl.DateTimeFormat('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              year: 'numeric',
                                          }).format(new Date(reminder.reminderDate))}`
                                        : ''}
                                </p>{' '}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => onEdit(reminder)}
                                variant="outline"
                                size="icon"
                                className="text-teal-600 hover:text-teal-700"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => onDelete(reminder.id!)}
                                variant="outline"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.li>
                ))}
            </AnimatePresence>
        </motion.ul>
    );
}

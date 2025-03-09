import type React from 'react';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Reminder } from '../';

const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

type ReminderModalProps = {
    onClose: () => void;
    onSave: (reminder: Reminder) => void;
    reminder?: Reminder | null;
};

export default function ReminderModal({ onClose, onSave, reminder }: ReminderModalProps) {
    const [name, setName] = useState(reminder?.name || '');
    const [numberToTake, setNumberToTake] = useState(reminder?.numberToTake.toString() || '1');
    const [isEveryday, setIsEveryday] = useState(reminder?.isEveryday ?? true);
    const [time, setTime] = useState(reminder?.time || '');
    const [reminderDate, setReminderDate] = useState(reminder?.reminderDate || getCurrentDate());

    console.log('reminder', reminder);
    useEffect(() => {
        if (reminder) {
            setName(reminder.name);
            setNumberToTake(reminder.numberToTake.toString());
            setIsEveryday(reminder.isEveryday);
            setTime(reminder.time);
            setReminderDate(reminder.reminderDate || getCurrentDate());
        } else {
            setReminderDate(getCurrentDate());
        }
    }, [reminder]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            _id: reminder?._id || undefined,
            name,
            numberToTake: Number.parseInt(numberToTake),
            isEveryday,
            time,
            reminderDate: isEveryday ? undefined : reminderDate,
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-teal-50">
                <DialogHeader>
                    <DialogTitle>{reminder ? 'Edit Reminder' : 'Create Reminder'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div>
                        <Label htmlFor="name">Medicine Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="numberToTake">Number to Take</Label>
                        <Input
                            id="numberToTake"
                            type="number"
                            min="1"
                            value={numberToTake}
                            onChange={(e) => setNumberToTake(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label>Frequency</Label>
                        <RadioGroup
                            value={isEveryday ? 'everyday' : 'specific'}
                            onValueChange={(value) => {
                                setIsEveryday(value === 'everyday');
                                if (value !== 'everyday') {
                                    setReminderDate(getCurrentDate());
                                }
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="everyday" id="everyday" />
                                <Label htmlFor="everyday">Every day</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="specific" id="specific" />
                                <Label htmlFor="specific">Specific Date</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {!isEveryday && (
                        <div>
                            <Label htmlFor="reminderDate">Date</Label>
                            <Input
                                id="reminderDate"
                                type="date"
                                value={format(new Date(reminderDate), 'yyyy-MM-dd')}
                                min={getCurrentDate()}
                                onChange={(e) => setReminderDate(e.target.value)}
                                required={!isEveryday}
                            />
                        </div>
                    )}
                    <div>
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

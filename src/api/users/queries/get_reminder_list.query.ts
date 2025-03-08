import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface MedicineReminder {
    id: string;
    name: string;
    numberToTake: number;
    isEveryday: boolean;
    time: string;
    reminderDate?: string;
}

interface MedicineReminderResponse {
    message: string;
    data: MedicineReminder[];
}

const fetchMedicineReminders = async (): Promise<MedicineReminderResponse> => {
    const response = await Axios.get<MedicineReminderResponse>('/api/reminders/list');
    return response.data;
};

export const useMedicineReminders = () => {
    return useQuery<MedicineReminderResponse, Error>({
        queryKey: ['medicineReminders'],
        queryFn: fetchMedicineReminders,
        staleTime: 5000,
    });
};

import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface MedicineReminderRequest {
    name: string;
    numberToTake: number;
    isEveryday: boolean;
    time: string;
    reminderDate?: string;
}

interface MedicineReminderResponse {
    message: string;
}

const createMedicineReminder = async (data: MedicineReminderRequest): Promise<MedicineReminderResponse> => {
    const response = await Axios.post<MedicineReminderResponse>('/api/reminder/create', data);
    return response.data;
};

export const useCreateMedicineReminder = () => {
    return useMutation<MedicineReminderResponse, Error, MedicineReminderRequest>({
        mutationFn: createMedicineReminder,
    });
};

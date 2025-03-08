import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface UpdateMedicineReminderRequest {
    reminderId: string;
    name?: string;
    numberToTake?: number;
    isEveryday?: boolean;
    time?: string;
    reminderDate?: string;
}

interface UpdateMedicineReminderResponse {
    message: string;
}

const updateMedicineReminder = async ({
    reminderId,
    ...data
}: UpdateMedicineReminderRequest): Promise<UpdateMedicineReminderResponse> => {
    const response = await Axios.put<UpdateMedicineReminderResponse>(`/api/reminder/update/${reminderId}`, data);
    return response.data;
};

export const useUpdateMedicineReminder = () => {
    return useMutation<UpdateMedicineReminderResponse, Error, UpdateMedicineReminderRequest>({
        mutationFn: updateMedicineReminder,
    });
};

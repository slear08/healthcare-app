import { Axios } from '@/api/axios';
import { useMutation } from '@tanstack/react-query';

interface DeleteMedicineReminderResponse {
    message: string;
}

const deleteMedicineReminder = async (medicineReminderId: string): Promise<DeleteMedicineReminderResponse> => {
    const response = await Axios.delete<DeleteMedicineReminderResponse>(`/api/reminder/delete/${medicineReminderId}`);
    return response.data;
};

export const useDeleteMedicineReminder = () => {
    return useMutation<DeleteMedicineReminderResponse, Error, string>({
        mutationFn: deleteMedicineReminder,
    });
};

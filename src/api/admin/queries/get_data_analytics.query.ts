import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface WeeklyTrendData {
    name: string;
    value: number | null;
}

interface DashboardDataResponse {
    totalUsers: number;
    weeklyTrend: {
        newUsers: WeeklyTrendData[];
        totalQueues: WeeklyTrendData[];
    };
    totalWaitingToday: number;
    queueLimit: {
        status: 'ON' | 'OFF';
        limit: number;
    };
}

const fetchDashboardData = async (): Promise<DashboardDataResponse> => {
    const response = await Axios.get<DashboardDataResponse>('/api/data-analytics/dashboard');
    return response.data;
};

export const useDashboardData = () => {
    return useQuery<DashboardDataResponse, Error>({
        queryKey: ['dashboardData'],
        queryFn: fetchDashboardData,
        staleTime: 5000,
    });
};

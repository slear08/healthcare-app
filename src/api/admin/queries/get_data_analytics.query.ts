import { Axios } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface WeeklyTrendData {
    name: string;
    value: number | null;
}

interface QueueLimit {
    status: 'ON' | 'OFF';
    limit: number;
}

interface DashboardDataResponse {
    message: string;
    data: {
        totalUsers: number;
        weeklyTrend: {
            newUsers: WeeklyTrendData[];
            totalQueues: WeeklyTrendData[];
        };
        totalWaitingToday: number;
        queueLimit: QueueLimit;
    };
}

const fetchDashboardData = async () => {
    const response = await Axios.get<DashboardDataResponse>('/api/data-analytics/dashboard');
    return response.data.data;
};

export const useDashboardData = () => {
    return useQuery({
        queryKey: ['dashboardData'],
        queryFn: fetchDashboardData,
        staleTime: 5000,
    });
};

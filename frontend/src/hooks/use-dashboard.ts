import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Expense } from '@/types';

interface DashboardStats {
  totalExpenses: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    total: number;
    count: number;
  }>;
  recentExpenses: Expense[];
  dateRange: {
    start: string;
    end: string;
  };
}

interface GetDashboardParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

export const useDashboardStats = (params?: GetDashboardParams) => {
  return useQuery({
    queryKey: ['dashboard', 'stats', params],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await api.get('/dashboard/stats', { params });
      return response.data;
    },
  });
};


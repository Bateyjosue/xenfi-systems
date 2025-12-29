import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Expense, User } from '@/types';

interface AdminStats {
  users: {
    total: number;
    admins: number;
    staff: number;
    recent: number;
  };
  expenses: {
    total: number;
    totalAmount: number;
    recent: number;
  };
  userExpenseStats: Array<{
    userId: string;
    userName: string;
    userEmail?: string;
    userRole: 'ADMIN' | 'STAFF';
    expenseCount: number;
    totalAmount: number;
  }>;
  categoryStats: Array<{
    categoryId: string;
    categoryName: string;
    usageCount: number;
    totalAmount: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    count: number;
    total: number;
  }>;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<AdminStats> => {
      const response = await api.get('/admin/stats');
      return response.data;
    },
    staleTime: 0, // Always refetch when invalidated
    refetchOnWindowFocus: true,
  });
};

interface GetAllExpensesParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  userId?: string;
}

export const useAllExpenses = (params?: GetAllExpensesParams) => {
  return useQuery({
    queryKey: ['admin', 'expenses', params],
    queryFn: async (): Promise<Expense[]> => {
      const response = await api.get('/admin/expenses', { params });
      return response.data;
    },
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async (): Promise<User[]> => {
      const response = await api.get('/admin/users');
      return response.data;
    },
  });
};


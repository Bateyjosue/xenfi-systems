import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Expense, CreateExpenseDto, UpdateExpenseDto } from "@/types";

interface GetExpensesParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

export const useExpenses = (params?: GetExpensesParams) => {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: async (): Promise<Expense[]> => {
      const response = await api.get("/expenses", { params });
      return response.data;
    },
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: async (): Promise<Expense> => {
      const response = await api.get(`/expenses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpenseDto): Promise<Expense> => {
      const response = await api.post("/expenses", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all expenses queries
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      // Invalidate all dashboard queries (with any params)
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Force refetch dashboard stats
      queryClient.refetchQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateExpenseDto;
    }): Promise<Expense> => {
      const response = await api.put(`/expenses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.refetchQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.refetchQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

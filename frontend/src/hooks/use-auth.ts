import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { LoginDto, RegisterDto, AuthResponse, User } from '@/types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginDto): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterDto): Promise<AuthResponse> => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async (): Promise<User> => {
      const response = await api.get('/auth/me');
      return response.data;
    },
    retry: false,
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
  };
};


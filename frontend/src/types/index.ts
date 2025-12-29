export type UserRole = 'ADMIN' | 'STAFF';
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'OTHER';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  date: string;
  paymentMethod: PaymentMethod;
  attachmentUrl?: string;
  categoryId: string;
  category: Category;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  amount: number;
  description?: string;
  date: string;
  paymentMethod: PaymentMethod;
  attachmentUrl?: string;
  categoryId: string;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}


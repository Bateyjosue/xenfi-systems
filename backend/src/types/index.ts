import { Request } from "express";

// Generic Authenticated Request type compatible with Express's generic Request
export interface AuthRequest<P = any, ResBody = any, ReqBody = any>
  extends Request<P, ResBody, ReqBody> {
  userId?: string;
  user?: {
    id: string;
    email: string;
    role: "ADMIN" | "STAFF";
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface CreateExpenseDto {
  amount: number;
  description?: string;
  date: string;
  paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY" | "OTHER";
  attachmentUrl?: string;
  categoryId: string;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

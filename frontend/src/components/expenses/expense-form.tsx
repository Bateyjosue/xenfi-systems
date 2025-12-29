'use client';

import { useState, useEffect } from 'react';
import { useCreateExpense, useUpdateExpense } from '@/hooks/use-expenses';
import { useCategories } from '@/hooks/use-categories';
import { Expense, PaymentMethod, CreateExpenseDto } from '@/types';
import { FileUpload } from '@/components/ui/file-upload';

interface ExpenseFormProps {
  expense?: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'CASH',
  'CARD',
  'BANK_TRANSFER',
  'MOBILE_MONEY',
  'OTHER',
];

export function ExpenseForm({ expense, onClose, onSuccess }: ExpenseFormProps) {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const { data: categories } = useCategories();

  const [formData, setFormData] = useState<CreateExpenseDto>(() => ({
    amount: expense?.amount || 0,
    description: expense?.description || '',
    date: expense?.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
    paymentMethod: expense?.paymentMethod || 'CARD',
    attachmentUrl: expense?.attachmentUrl || '',
    categoryId: expense?.categoryId || '',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (expense) {
        await updateExpense.mutateAsync({ id: expense.id, data: formData });
      } else {
        await createExpense.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      // Error handled by React Query
    }
  };

  const isLoading = createExpense.isPending || updateExpense.isPending;
  const error = createExpense.error || updateExpense.error;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {expense ? 'Edit Expense' : 'Create Expense'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method *
              </label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FileUpload 
                label="Receipt / Attachment"
                defaultUrl={formData.attachmentUrl}
                onUploadComplete={(url) => setFormData({ ...formData, attachmentUrl: url })}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : expense ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


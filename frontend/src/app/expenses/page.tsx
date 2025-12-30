'use client';

import { useState } from 'react';
import { useExpenses, useDeleteExpense } from '@/hooks/use-expenses';
import { useCategories } from '@/hooks/use-categories';
import { Expense, PaymentMethod } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { ConfirmModal } from '@/components/common/confirm-modal';

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; expenseId: string | null }>({
    isOpen: false,
    expenseId: null,
  });

  const { data: expenses, isLoading } = useExpenses({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    categoryId: categoryId || undefined,
  });

  const { data: categories } = useCategories();
  const deleteExpense = useDeleteExpense();

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, expenseId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.expenseId) {
      try {
        await deleteExpense.mutateAsync(deleteConfirm.expenseId);
      } catch (error) {
        // Error handled by React Query
      }
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
        >
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white border border-gray-200 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setCategoryId('');
              }}
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Expense Form Drawer */}
      <ExpenseForm
        isOpen={showForm}
        expense={editingExpense}
        onClose={handleFormClose}
        onSuccess={handleFormClose}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, expenseId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Expenses Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200">
            {expenses && expenses.length > 0 ? (
              expenses.map((expense) => (
                <li key={expense.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            ${expense.amount.toFixed(2)}
                          </p>
                          <p className="ml-2 shrink-0 text-sm text-gray-500">
                            {expense.category.name}
                          </p>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {expense.description || 'No description'}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              {format(new Date(expense.date), 'MMM d, yyyy')} •{' '}
                              {expense.paymentMethod.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 shrink-0 flex space-x-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(expense.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-sm text-gray-500">
                No expenses found. Create your first expense!
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}


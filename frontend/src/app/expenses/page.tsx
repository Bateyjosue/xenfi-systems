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
    <div className="space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Expenses</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage and track your business spending</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center h-12 px-6 bg-teal-500 hover:bg-teal-400 text-zinc-950 text-sm font-bold rounded-full shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        >
          Add Expense
        </button>
      </div>

      {/* Filters (Mobile Optimized) */}
      <div className="glass-card rounded-2xl p-5 border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-950/50 border-zinc-800 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 py-2.5"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-zinc-950/50 border-zinc-800 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 py-2.5"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-zinc-950/50 border-zinc-800 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 py-2.5"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setCategoryId('');
            }}
            disabled={!startDate && !endDate && !categoryId}
            className="h-10 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl border border-white/5 transition-colors disabled:opacity-30"
          >
            Reset Filters
          </button>
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

      {/* Expenses List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-3xl border border-white/5 border-dashed">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-zinc-500 text-sm font-medium">Loading transactions...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses && expenses.length > 0 ? (
            expenses.map((expense) => (
              <div 
                key={expense.id} 
                className="group glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border border-white/5 hover:border-teal-500/30 hover:bg-zinc-800/80 transition-all shadow-lg active:scale-[0.99]"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xl">
                       {/* Simplified icon logic could be added here */}
                       💸
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate group-hover:text-teal-400 transition-colors">
                      {expense.description || 'Unspecified Expense'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-white/5">
                         {expense.category.name}
                       </span>
                       <span className="text-[10px] text-zinc-600 font-medium">
                         {format(new Date(expense.date), 'MMM d, yyyy')}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-lg font-black text-white">
                    ${expense.amount.toFixed(2)}
                  </p>
                  <div className="flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(expense); }}
                      className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(expense.id); }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
               <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               </div>
               <p className="text-zinc-400 font-bold">No expenses found</p>
               <p className="text-zinc-600 text-xs mt-1">Try changing your filters or add a new expense</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


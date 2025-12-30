'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories, useDeleteCategory } from '@/hooks/use-categories';
import { useAuthStore } from '@/stores/auth-store';
import { Category } from '@/types';
import { CategoryForm } from '@/components/categories/category-form';
import { ConfirmModal } from '@/components/common/confirm-modal';

export default function CategoriesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; categoryId: string | null }>({
    isOpen: false,
    categoryId: null,
  });

  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.role !== 'ADMIN') {
    return null;
  }

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, categoryId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.categoryId) {
      try {
        await deleteCategory.mutateAsync(deleteConfirm.categoryId);
      } catch (error) {
        // Error handled by React Query
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Categories</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage expense categories and groupings</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center h-12 px-6 bg-teal-500 hover:bg-teal-400 text-zinc-950 text-sm font-bold rounded-full shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        >
          Add Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, categoryId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? Expenses using this category will not be deleted."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-3xl border border-white/5 border-dashed">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-zinc-500 text-sm font-medium">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="group glass-card rounded-2xl p-6 border border-white/5 hover:border-teal-500/30 hover:bg-zinc-800/80 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                   </div>
                   <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-teal-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{category.description}</p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
               <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                   <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
               </div>
               <p className="text-zinc-400 font-bold">No categories found</p>
               <p className="text-zinc-600 text-xs mt-1">Create your first category to start organizing</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


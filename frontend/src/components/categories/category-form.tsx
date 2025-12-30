'use client';

import { useState, useEffect } from 'react';
import { useCreateCategory, useUpdateCategory } from '@/hooks/use-categories';
import { Category, CreateCategoryDto } from '@/types';

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryForm({ category, onClose, onSuccess }: CategoryFormProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: category?.name || '',
    description: category?.description || '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, data: formData });
      } else {
        await createCategory.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      // Error handled by React Query
    }
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;
  const error = createCategory.error || updateCategory.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-white tracking-tight">
              {category ? 'Edit Category' : 'New Category'}
            </h3>
            <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Category Name
              </label>
              <input
                type="text"
                required
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Marketing, Travel, Food"
                className="w-full bg-zinc-950/50 border-zinc-800 text-white text-base rounded-2xl focus:ring-teal-500 focus:border-teal-500 px-5 py-3.5 placeholder-zinc-700 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe what this category is for..."
                className="w-full bg-zinc-950/50 border-zinc-800 text-white text-base rounded-2xl focus:ring-teal-500 focus:border-teal-500 px-5 py-3.5 placeholder-zinc-700 transition-all"
              />
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-shake">
                {error instanceof Error ? error.message : 'An error occurred'}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-14 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-2xl transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-2 h-14 bg-teal-500 hover:bg-teal-400 text-zinc-950 text-sm font-black rounded-2xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:scale-100 transition-all active:scale-95 px-8"
              >
                {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


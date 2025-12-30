'use client';

import { useState, useEffect } from 'react';
import { useCreateExpense, useUpdateExpense } from '@/hooks/use-expenses';
import { useCategories } from '@/hooks/use-categories';
import { Expense, PaymentMethod, CreateExpenseDto } from '@/types';
import { FileUpload } from '@/components/ui/file-upload';
import { MobileDrawer } from '@/components/ui/mobile-drawer';
import { 
  BanknotesIcon, 
  CreditCardIcon, 
  ShoppingBagIcon, 
  TruckIcon, 
  HomeIcon,
  VideoCameraIcon,
  CakeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { cn } from '@/lib/utils'; // Assuming you have this utility

interface ExpenseFormProps {
  isOpen: boolean;
  expense?: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: any }[] = [
  { value: 'CASH', label: 'Cash', icon: BanknotesIcon },
  { value: 'CARD', label: 'Card', icon: CreditCardIcon },
  { value: 'BANK_TRANSFER', label: 'Transfer', icon: HomeIcon },
  { value: 'MOBILE_MONEY', label: 'Mobile Money', icon: CreditCardIcon }, // Using card icon as placeholder
  { value: 'OTHER', label: 'Other', icon: QuestionMarkCircleIcon },
];

const CATEGORY_ICONS: Record<string, any> = {
  'food': CakeIcon,
  'meal': CakeIcon,
  'restaurant': CakeIcon,
  'dining': CakeIcon,
  'drink': CakeIcon,
  'transport': TruckIcon,
  'car': TruckIcon,
  'travel': TruckIcon,
  'shopping': ShoppingBagIcon,
  'cloth': ShoppingBagIcon,
  'housing': HomeIcon,
  'rent': HomeIcon,
  'home': HomeIcon,
  'utilities': HomeIcon,
  'electricity': HomeIcon,
  'water': HomeIcon,
  'entertainment': VideoCameraIcon,
  'movie': VideoCameraIcon,
  'game': VideoCameraIcon,
  'education': AcademicCapIcon,
  'school': AcademicCapIcon,
  'course': AcademicCapIcon,
  'work': BriefcaseIcon,
  'business': BriefcaseIcon,
  'office': BriefcaseIcon,
  'health': HeartIcon, // I see I need to import this
  'medical': HeartIcon,
  'pharmacy': HeartIcon,
};

export function ExpenseForm({ isOpen, expense, onClose, onSuccess }: ExpenseFormProps) {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const { data: categories } = useCategories();

  // Reset form when opening/closing or changing expense
  useEffect(() => {
    if (isOpen) {
        setFormData({
            amount: expense?.amount || 0,
            description: expense?.description || '',
            date: expense?.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
            paymentMethod: expense?.paymentMethod || 'CARD',
            attachmentUrl: expense?.attachmentUrl || '',
            categoryId: expense?.categoryId || '',
        });
    }
  }, [isOpen, expense]);

  const [formData, setFormData] = useState<CreateExpenseDto>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'CARD',
    attachmentUrl: '',
    categoryId: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.categoryId) {
      setValidationError('Please select a category');
      return;
    }

    try {
      if (expense) {
        await updateExpense.mutateAsync({ id: expense.id, data: formData });
      } else {
        await createExpense.mutateAsync(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      // Error handled by React Query
    }
  };

  const isLoading = createExpense.isPending || updateExpense.isPending;
  const error = createExpense.error || updateExpense.error || validationError;

  // Helper to get icon for category
  const getCategoryIcon = (name: string) => {
    const key = Object.keys(CATEGORY_ICONS).find(k => name.toLowerCase().includes(k));
    return key ? CATEGORY_ICONS[key] : QuestionMarkCircleIcon;
  };

  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose} title={expense ? 'Edit Expense' : 'New Expense'}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-8">
        
        {/* BIG AMOUNT INPUT */}
        <div className="flex flex-col items-center justify-center pt-6 pb-2">
           <label className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3 opacity-80">Amount</label>
           <div className="flex items-baseline justify-center">
             <span className="text-3xl font-bold text-teal-500/50 mr-2">$</span>
             <input
                type="number"
                step="0.01"
                required
                autoFocus
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                placeholder="0.00"
                className="block min-w-[200px] text-center bg-transparent border-none p-0 text-7xl font-bold text-white placeholder-zinc-800 focus:ring-0 appearance-none"
             />
           </div>
        </div>

        {/* CATEGORY GRID */}
        <div>
           <label className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4 block opacity-80">Category</label>
           <div className="grid grid-cols-4 gap-x-4 gap-y-6">
              {categories?.map((cat) => {
                  const Icon = getCategoryIcon(cat.name);
                  const isSelected = formData.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg ring-1 ring-white/5",
                        isSelected 
                          ? "bg-teal-500 text-white shadow-teal-500/30 scale-105" 
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                      )}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className={cn(
                        "text-xs font-medium truncate w-full text-center transition-colors",
                        isSelected ? "text-teal-400" : "text-zinc-500 group-hover:text-zinc-300"
                      )}>
                        {cat.name}
                      </span>
                    </button>
                  )
              })}
           </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-4 bg-zinc-800/50 p-4 rounded-xl border border-white/5">
             {/* Payment Method & Date Row */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1 block">Date</label>
                   <div className="relative">
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-zinc-900 border-zinc-700 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 pl-9"
                      />
                      <CalendarIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                   </div>
                </div>
                 <div>
                   <label className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1 block">Method</label>
                   <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                      className="w-full bg-zinc-900 border-zinc-700 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500"
                   >
                     {PAYMENT_METHODS.map(m => (
                       <option key={m.value} value={m.value}>{m.label}</option>
                     ))}
                   </select>
                </div>
             </div>

             {/* Description */}
             <div>
                <label className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1 block">Note</label>
                <div className="relative">
                   <textarea
                     rows={1}
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     placeholder="What was this for?"
                     className="w-full bg-zinc-900 border-zinc-700 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 pl-9"
                   />
                   <DocumentTextIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
             </div>

             {/* Attachment */}
             <div className="pt-2">
                <FileUpload 
                    label="RECEIPT"
                    defaultUrl={formData.attachmentUrl}
                    onUploadComplete={(url) => setFormData({ ...formData, attachmentUrl: url })}
                />
             </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error instanceof Error ? error.message : 'Failed to save expense'}
            </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 pb- safe-area-pb">
           <button
             type="submit"
             disabled={isLoading}
             className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-900 font-bold text-lg py-4 rounded-full shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
           >
             {isLoading ? 'Saving...' : 'Save Expense'}
           </button>
        </div>
      </form>
    </MobileDrawer>
  );
}


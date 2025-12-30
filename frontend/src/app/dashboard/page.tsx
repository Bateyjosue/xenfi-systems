'use client';

import { useState } from 'react';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { useAdminStats } from '@/hooks/use-admin';
import { useCategories } from '@/hooks/use-categories';
import { useAuthStore } from '@/stores/auth-store';
import { format } from 'date-fns';
import { 
  BanknotesIcon, 
  UserGroupIcon, 
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const user = useAuthStore((state) => state.user);

  const { data: stats, isLoading } = useDashboardStats({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    categoryId: categoryId || undefined,
  });

  const { data: adminStats } = useAdminStats();
  const { data: categories } = useCategories();

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setCategoryId('');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-3xl font-extrabold leading-7 text-white sm:truncate sm:text-4xl sm:tracking-tight">
            Dashboard
          </h2>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
             {isAdmin ? 'System overview and live analytics' : 'Track your spending and manage your business expenses'}
          </p>
        </div>
      </div>

      {/* Admin Stats */}
      {isAdmin && adminStats && (
        <section>
          <h3 className="text-lg font-medium leading-6 text-white mb-4">System Overview</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Users" 
              value={adminStats.users.total} 
              subtext={`${adminStats.users.admins} admins, ${adminStats.users.staff} staff`}
              icon={UserGroupIcon}
              color="teal"
            />
            <StatsCard 
              title="System Expenses" 
              value={`$${adminStats.expenses.totalAmount.toFixed(2)}`}
              subtext={`${adminStats.expenses.total} total records`}
              icon={BanknotesIcon}
              color="emerald"
            />
             <StatsCard 
              title="Recent Expenses" 
              value={adminStats.expenses.recent}
              subtext="Last 30 days"
              icon={ClockIcon}
              color="blue"
            />
             <StatsCard 
              title="New Users" 
              value={adminStats.users.recent}
              subtext="Last 30 days"
              icon={UserGroupIcon}
              color="violet"
            />
          </div>
        </section>
      )}

      {/* Personal/User Stats */}
      <section>
          <div className="md:flex md:items-center md:justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-white">
               {isAdmin ? 'Your Personal Analytics' : 'Overview'}
            </h3>
          </div>
          
           {/* Filters */}
          <div className="glass-card rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
               <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-zinc-500">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full rounded-lg border-zinc-800 bg-zinc-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-zinc-500">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-lg border-zinc-800 bg-zinc-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                  />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-semibold uppercase text-zinc-500">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full rounded-lg border-zinc-800 bg-zinc-900/50 py-1.5 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
               </div>
               <div>
                  {(startDate || endDate || categoryId) && (
                    <button
                      onClick={handleReset}
                      className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-zinc-700 hover:bg-zinc-700"
                    >
                      <XMarkIcon className="-ml-0.5 h-5 w-5 text-zinc-400" aria-hidden="true" />
                      Clear
                    </button>
                  )}
               </div>
            </div>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
             </div>
          ) : stats ? (
            <div className="space-y-6">
                {/* Main Stat */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20 ring-1 ring-black/5">
                   <div className="p-8 text-white">
                      <p className="text-sm font-medium text-teal-100 uppercase tracking-wide">Total Expenses</p>
                      <p className="mt-2 text-5xl font-bold tracking-tight text-white">${stats.totalExpenses.toFixed(2)}</p>
                      <p className="mt-2 text-sm text-teal-100">
                        {stats.dateRange.start && stats.dateRange.end ? `${format(new Date(stats.dateRange.start), 'MMM d')} - ${format(new Date(stats.dateRange.end), 'MMM d, yyyy')}` : 'All time'}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Breakdown */}
                   <div className="glass-card rounded-xl">
                      <div className="p-6 border-b border-white/5">
                        <h3 className="text-base font-semibold leading-6 text-white">Category Breakdown</h3>
                      </div>
                      <div className="overflow-hidden">
                         {stats.categoryBreakdown.length === 0 ? (
                           <p className="p-6 text-center text-zinc-500">No data available</p>
                         ) : (
                           <ul role="list" className="divide-y divide-white/5">
                              {stats.categoryBreakdown.map((item) => (
                                <li key={item.categoryId} className="flex justify-between gap-x-6 py-4 px-6 hover:bg-white/5 transition-colors">
                                   <div className="flex gap-x-4">
                                      <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-white">{item.categoryName}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-zinc-500">{item.count} transactions</p>
                                      </div>
                                   </div>
                                    <div className="flex flex-col items-end">
                                      <p className="text-sm leading-6 text-white font-bold">${item.total.toFixed(2)}</p>
                                    </div>
                                </li>
                              ))}
                           </ul>
                         )}
                      </div>
                   </div>

                   {/* Recent Expenses List */}
                   <div className="glass-card rounded-xl">
                      <div className="p-6 border-b border-white/5">
                        <h3 className="text-base font-semibold leading-6 text-white">Recent Transactions</h3>
                      </div>
                      <div>
                         {stats.recentExpenses.length === 0 ? (
                            <p className="p-6 text-center text-zinc-500">No recent transactions</p>
                         ) : (
                           <ul role="list" className="divide-y divide-white/5">
                              {stats.recentExpenses.map((expense) => (
                                 <li key={expense.id} className="relative flex justify-between gap-x-6 py-4 px-6 hover:bg-white/5 transition-colors">
                                    <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
                                      <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-white">
                                           {expense.description || 'Unspecified'}
                                        </p>
                                        <div className="mt-1 flex text-xs leading-5 text-zinc-500">
                                          <span className="relative truncate">{expense.category.name}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-auto items-center justify-between sm:w-1/2 sm:flex-none">
                                       <div className="hidden sm:block">
                                          <p className="text-xs leading-5 text-zinc-500">{format(new Date(expense.date), 'MMM d')}</p>
                                       </div>
                                       <div className="flex-none">
                                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 ring-1 ring-inset ring-white/10">
                                            ${expense.amount.toFixed(2)}
                                          </span>
                                       </div>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                         )}
                      </div>
                   </div>
                </div>
            </div>
          ) : null}
      </section>
    </div>
  );
}

function StatsCard({ title, value, subtext, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        teal: 'bg-teal-500/10 text-teal-500',
        emerald: 'bg-emerald-500/10 text-emerald-500',
        blue: 'bg-blue-500/10 text-blue-500',
        violet: 'bg-violet-500/10 text-violet-500',
        indigo: 'bg-indigo-500/10 text-indigo-500',
    };

    return (
        <div className="glass-card overflow-hidden rounded-2xl p-4 transition-all hover:bg-zinc-800/80">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className="truncate text-sm font-medium text-zinc-500">{title}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
                    {subtext && <p className="mt-1 text-xs text-zinc-600">{subtext}</p>}
                </div>
                <div className={cn("rounded-xl p-2.5", colorClasses[color] || colorClasses.teal)}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    )
}

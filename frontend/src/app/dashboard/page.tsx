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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
             {isAdmin ? 'System overview and analytics' : 'Track your expenses and spending'}
          </p>
        </div>
      </div>

      {/* Admin Stats */}
      {isAdmin && adminStats && (
        <section>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">System Overview</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Users" 
              value={adminStats.users.total} 
              subtext={`${adminStats.users.admins} admins, ${adminStats.users.staff} staff`}
              icon={UserGroupIcon}
              color="indigo"
            />
            <StatsCard 
              title="System Expenses" 
              value={`$${adminStats.expenses.totalAmount.toFixed(2)}`}
              subtext={`${adminStats.expenses.total} total records`}
              icon={BanknotesIcon}
              color="green"
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
              color="purple"
            />
          </div>
        </section>
      )}

      {/* Personal/User Stats */}
      <section>
          <div className="md:flex md:items-center md:justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
               {isAdmin ? 'Your Personal Analytics' : 'Overview'}
            </h3>
          </div>
          
           {/* Filters */}
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
               <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-gray-500">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-gray-500">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-semibold uppercase text-gray-500">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <XMarkIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Clear
                    </button>
                  )}
               </div>
            </div>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
             </div>
          ) : stats ? (
            <div className="space-y-6">
                {/* Main Stat */}
                <div className="overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg ring-1 ring-black/5">
                   <div className="p-6 text-white">
                      <p className="text-sm font-medium text-indigo-100">Total Expenses</p>
                      <p className="mt-2 text-4xl font-bold tracking-tight text-white">${stats.totalExpenses.toFixed(2)}</p>
                      <p className="mt-1 text-sm text-indigo-100">
                        {stats.dateRange.start && stats.dateRange.end ? `${format(new Date(stats.dateRange.start), 'MMM d')} - ${format(new Date(stats.dateRange.end), 'MMM d, yyyy')}` : 'All time'}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Breakdown */}
                   <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Category Breakdown</h3>
                      </div>
                      <div className="overflow-hidden">
                         {stats.categoryBreakdown.length === 0 ? (
                           <p className="p-6 text-center text-gray-500">No data available</p>
                         ) : (
                           <ul role="list" className="divide-y divide-gray-100">
                              {stats.categoryBreakdown.map((item) => (
                                <li key={item.categoryId} className="flex justify-between gap-x-6 py-4 px-6 hover:bg-gray-50/50">
                                   <div className="flex gap-x-4">
                                      <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{item.categoryName}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{item.count} transactions</p>
                                      </div>
                                   </div>
                                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                                      <p className="text-sm leading-6 text-gray-900 font-bold">${item.total.toFixed(2)}</p>
                                    </div>
                                    {/* Mobile price */}
                                    <div className="flex sm:hidden flex-col items-end">
                                       <p className="text-sm leading-6 text-gray-900 font-bold">${item.total.toFixed(2)}</p>
                                    </div>
                                </li>
                              ))}
                           </ul>
                         )}
                      </div>
                   </div>

                   {/* Recent Expenses List */}
                   <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Transactions</h3>
                      </div>
                      <div>
                         {stats.recentExpenses.length === 0 ? (
                            <p className="p-6 text-center text-gray-500">No recent transactions</p>
                         ) : (
                           <ul role="list" className="divide-y divide-gray-100">
                              {stats.recentExpenses.map((expense) => (
                                 <li key={expense.id} className="relative flex justify-between gap-x-6 py-4 px-6 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
                                      <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                           {expense.description || 'Unspecified'}
                                        </p>
                                        <div className="mt-1 flex text-xs leading-5 text-gray-500">
                                          <span className="relative truncate hover:underline">{expense.category.name}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-auto items-center justify-between sm:w-1/2 sm:flex-none">
                                       <div className="hidden sm:block">
                                          <p className="text-xs leading-5 text-gray-500">{format(new Date(expense.date), 'MMM d, yyyy')}</p>
                                       </div>
                                       <div className="flex-none">
                                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className="truncate text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
                    {subtext && <p className="mt-1 text-xs text-gray-400">{subtext}</p>}
                </div>
                <div className={cn("rounded-lg p-2", colorClasses[color] || colorClasses.indigo)}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    )
}

'use client';

import { useState } from 'react';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { useAdminStats } from '@/hooks/use-admin';
import { useCategories } from '@/hooks/use-categories';
import { useAuthStore } from '@/stores/auth-store';
import { format } from 'date-fns';

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

  const { data: adminStats, isLoading: adminLoading } = useAdminStats();
  const { data: categories } = useCategories();

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setCategoryId('');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isAdmin ? 'System overview and your expense analytics' : 'Overview of your expenses and spending patterns'}
        </p>
      </div>

      {/* Admin Stats Section */}
      {isAdmin && adminStats && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-indigo-600">
                      {adminStats.users.total}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-xs text-gray-400">
                        {adminStats.users.admins} admins, {adminStats.users.staff} staff
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-green-600">
                      {adminStats.expenses.total}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        System Expenses
                      </dt>
                      <dd className="text-xs text-gray-400">
                        ${adminStats.expenses.totalAmount.toFixed(2)} total
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-blue-600">
                      {adminStats.expenses.recent}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Recent Expenses
                      </dt>
                      <dd className="text-xs text-gray-400">
                        Last 30 days
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-purple-600">
                      {adminStats.users.recent}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        New Users
                      </dt>
                      <dd className="text-xs text-gray-400">
                        Last 30 days
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Expenses Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isAdmin ? 'Your Personal Expenses' : 'Your Expenses'}
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(startDate || endDate || categoryId) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : stats ? (
        <>
          {/* Total Expenses Card */}
            <div className="bg-white border border-gray-200 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${stats.totalExpenses.toFixed(2)}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Expenses
                      </dt>
                      <dd className="text-xs text-gray-400">
                        {stats.dateRange.start && stats.dateRange.end && (
                          <>
                            {format(new Date(stats.dateRange.start), 'MMM d, yyyy')} -{' '}
                            {format(new Date(stats.dateRange.end), 'MMM d, yyyy')}
                          </>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Breakdown by Category
                </h3>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.categoryBreakdown.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                            No expenses found
                          </td>
                        </tr>
                      ) : (
                        stats.categoryBreakdown.map((item) => (
                          <tr key={item.categoryId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.categoryName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${item.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.count}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Expenses
                </h3>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {stats.recentExpenses.length === 0 ? (
                      <li className="py-4 text-center text-sm text-gray-500">
                        No recent expenses
                      </li>
                    ) : (
                      stats.recentExpenses.map((expense) => (
                        <li key={expense.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {expense.description || 'No description'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {expense.category.name} •{' '}
                                {format(new Date(expense.date), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <p className="text-sm font-medium text-gray-900">
                                ${expense.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}


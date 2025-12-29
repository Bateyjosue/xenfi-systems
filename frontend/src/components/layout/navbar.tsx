'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logout = useLogout();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(path);
  };

  const linkClass = (path: string) => {
    const active = isActive(path);
    return `${
      active
        ? 'border-indigo-500 text-gray-900 dark:text-gray-100'
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`;
  };

  const mobileLinkClass = (path: string) => {
    const active = isActive(path);
    return `${
      active
        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                XenFi Systems
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className={linkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link href="/expenses" className={linkClass('/expenses')}>
                Expenses
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/categories" className={linkClass('/categories')}>
                  Categories
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className={linkClass('/admin')}>
                  Admin
                </Link>
              )}
            </div>
          </div>
          {/* Desktop User Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <div className="shrink-0">
              <span className="text-sm text-gray-700 dark:text-gray-300 mr-4">
                {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Full screen overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          {/* Semi-transparent backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu content */}
          <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-md flex flex-col">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 px-4 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLinkClass('/dashboard')}
              >
                Dashboard
              </Link>
              <Link
                href="/expenses"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLinkClass('/expenses')}
              >
                Expenses
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass('/categories')}
                >
                  Categories
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass('/admin')}
                >
                  Admin
                </Link>
              )}
              {/* Dark Mode Toggle in Mobile Menu */}
              <button
                onClick={toggleTheme}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>

            {/* User section */}
            <div className="px-4 pt-4 pb-6 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-sm">
                      {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


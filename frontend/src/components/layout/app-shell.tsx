'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useMe } from '@/hooks/use-auth';
import { MobileSidebar, DesktopSidebar } from './sidebar';
import { Header } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading, isError } = useMe();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isChecking, setIsChecking] = useState(true);

  // Auth check effect
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setAuth(user);
        setIsChecking(false);
      } else if (isError) {
        setIsChecking(false);
        router.push('/auth/login');
      }
    }
  }, [user, isLoading, isError, setAuth, router]);

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !user) {
    return null; 
  }

  return (
    <div>
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <DesktopSidebar />

      <div className="lg:pl-72">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

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
    console.log('AppShell: Auth check', { user, isLoading, isError });
    if (!isLoading) {
      if (user) {
        console.log('AppShell: User authenticated', user);
        setAuth(user);
        setIsChecking(false);
      } else if (isError) {
        console.log('AppShell: Auth error! The server did not recognize your session.');
        console.log('Check if the "token" cookie exists in DevTools -> Application -> Cookies');
        
        // Wait 2 seconds before redirecting so you can see this log
        const timeout = setTimeout(() => {
          setIsChecking(false);
          router.push('/auth/login');
        }, 2000);
        return () => clearTimeout(timeout);
      } else {
        console.log('AppShell: No user and no error yet');
      }
    }
  }, [user, isLoading, isError, setAuth, router]);

  if (isChecking || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="mt-4 text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">Initializing XenFi</p>
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

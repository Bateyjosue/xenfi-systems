'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const userParam = searchParams.get('user');
    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setAuth(user);
        router.push('/dashboard');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        router.push('/auth/login?error=google_auth_failed');
      }
    } else {
      router.push('/auth/login');
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}


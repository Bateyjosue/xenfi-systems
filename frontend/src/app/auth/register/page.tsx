'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/use-auth';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register.mutateAsync({ email, password, name });
      router.push('/dashboard');
    } catch {
      // Error is handled by React Query
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 sm:px-6 lg:px-8 font-sans selection:bg-teal-500/30">
      <div className="max-w-md w-full">
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/20 mb-6 group transition-transform hover:scale-110 duration-300">
             <svg className="w-10 h-10 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Join XenFi</h1>
          <p className="mt-2 text-zinc-500 font-medium tracking-wide">Create your intelligence profile</p>
        </div>

        {/* Register Card */}
        <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
          
          <form className="space-y-6 relative" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Full Identity</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-900/50 border-zinc-800 text-white text-base rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 px-5 py-4 placeholder-zinc-700 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-900/50 border-zinc-800 text-white text-base rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 px-5 py-4 placeholder-zinc-700 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Security Pass</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border-zinc-800 text-white text-base rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 px-5 py-4 placeholder-zinc-700 transition-all outline-none"
                />
              </div>
            </div>

            {register.isError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center animate-shake">
                {register.error instanceof Error ? register.error.message : 'Registry conflict detected'}
              </div>
            )}

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full h-16 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
            >
              {register.isPending ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Initialize Account
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="text-xs font-bold text-zinc-500 hover:text-white transition-colors"
              >
                Already have an operative? <span className="text-teal-500">Sign In</span>
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em]">
          End-to-End Encrypted Data Infrastructure
        </p>
      </div>
    </div>
  );
}


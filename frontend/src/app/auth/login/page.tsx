'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/use-auth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by React Query
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 sm:px-6 lg:px-8 font-sans selection:bg-teal-500/30">
      <div className="max-w-md w-full">
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/20 mb-6 group transition-transform hover:scale-110 duration-300">
             <svg className="w-10 h-10 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">XenFi Systems</h2>
          <p className="mt-2 text-zinc-500 font-medium tracking-wide">Enterprise Expense Intelligence</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 blur-[80px] rounded-full group-hover:bg-teal-500/20 transition-colors" />
          
          <form className="space-y-6 relative" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Email Connection</label>
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
                <div className="flex justify-between items-center px-1">
                   <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Security Pass</label>
                   <button type="button" className="text-[10px] font-bold text-teal-500 uppercase tracking-widest hover:text-teal-400 transition-colors">Forgot?</button>
                </div>
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

            {login.isError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center animate-shake">
                {login.error instanceof Error ? login.error.message : 'Invalid sequence detected'}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full h-16 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
            >
              {login.isPending ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Establish Session
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/auth/register"
                className="text-xs font-bold text-zinc-500 hover:text-white transition-colors"
              >
                New operative? <span className="text-teal-500">Register System Access</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 grid grid-cols-2 gap-4">
           <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 transition-colors hover:bg-zinc-900/60 group">
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover:text-teal-500 transition-colors">Admin Node</div>
              <div className="text-[11px] text-zinc-500 font-mono">admin@xenfi.com</div>
              <div className="text-[11px] text-zinc-500 font-mono">admin123</div>
           </div>
           <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 transition-colors hover:bg-zinc-900/60 group">
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover:text-teal-500 transition-colors">Staff Node</div>
              <div className="text-[11px] text-zinc-500 font-mono">staff@xenfi.com</div>
              <div className="text-[11px] text-zinc-500 font-mono">staff123</div>
           </div>
        </div>
      </div>
    </div>
  );
}


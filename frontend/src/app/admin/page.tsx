'use client';

import { useAdminStats, useAllUsers } from '@/hooks/use-admin';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { User } from '@/types';

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: allUsers, isLoading: usersLoading } = useAllUsers();

  if (statsLoading || usersLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="mt-4 text-zinc-500 text-sm font-medium">Analyzing system data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-card p-12 rounded-3xl text-center border border-white/5">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
           <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 17c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-white">No system data available</h3>
        <p className="mt-2 text-zinc-500">Statistics will appear once users start logging expenses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Admin Console</h1>
          <p className="mt-1 text-sm text-zinc-500 font-medium">Real-time system health and user analytics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full">
           <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
           <span className="text-xs font-bold text-teal-500 uppercase tracking-widest leading-none">Live System</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard 
           title="Total Network" 
           value={stats.users.total} 
           sub={`+${stats.users.recent} new`} 
           icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
           color="teal"
        />
        <AdminMetricCard 
           title="Gross Volume" 
           value={`$${stats.expenses.totalAmount.toFixed(0)}`} 
           sub={`${stats.expenses.total} receipts`} 
           icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
           color="emerald"
        />
        <AdminMetricCard 
           title="Velocity" 
           value={stats.expenses.recent} 
           sub="Transactions/30d" 
           icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
           color="blue"
        />
        <AdminMetricCard 
           title="Onboarding" 
           value={stats.users.recent} 
           sub="Activations/30d" 
           icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m9-10a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
           color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* All Staff List - Fixes "Staff not being fetched" */}
        <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-xl">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Staff Network</h3>
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider bg-zinc-950 px-2 py-0.5 rounded border border-white/5">
                {allUsers?.length || 0} Total
              </span>
           </div>
           <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5">
                 <thead className="bg-zinc-950/30">
                    <tr>
                       <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User Identity</th>
                       <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                       <th className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Activity</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {allUsers?.map((u: User) => (
                       <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-teal-500 font-bold text-xs">
                                   {(u.name?.[0] || u.email[0]).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                   <div className="text-sm font-bold text-white truncate">{u.name || 'Anonymous'}</div>
                                   <div className="text-xs text-zinc-500 truncate">{u.email}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={cn(
                                "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                                u.role === 'ADMIN' ? 'bg-teal-500/10 text-teal-500' : 'bg-zinc-800 text-zinc-400'
                             )}>
                                {u.role}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-400 font-medium">
                             {/* @ts-ignore - prisma count included in getAllUsers */}
                             {u._count?.expenses || 0} items
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* User Activity Stats */}
        <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-xl">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Expense Distribution</h3>
              <div className="text-xs text-zinc-500 font-medium">By volume</div>
           </div>
           <div className="p-6 space-y-6">
              {stats.userExpenseStats.slice(0, 5).map((stat) => (
                 <div key={stat.userId} className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-sm font-bold text-white">{stat.userName}</span>
                       <span className="text-sm font-black text-teal-400">${stat.totalAmount.toFixed(0)}</span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                       <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((stat.totalAmount / stats.expenses.totalAmount) * 100, 100)}%` }}
                       />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                       <span>{stat.expenseCount} entries</span>
                       <span>{((stat.totalAmount / stats.expenses.totalAmount) * 100).toFixed(1)}% weight</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Monthly Stats Summary */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
         <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Fiscal Performance</h3>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-white/5">
            {stats.monthlyTrend.map((m, i) => (
               <div key={i} className="p-6 flex flex-col items-center gap-1 hover:bg-white/5 transition-colors">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{m.month}</span>
                  <span className="text-lg font-black text-white">${m.total.toFixed(0)}</span>
                  <span className="text-[10px] font-bold text-teal-500/80 bg-teal-500/5 px-1.5 rounded">{m.count} items</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

function AdminMetricCard({ title, value, sub, icon, color }: any) {
   const colorMap: any = {
      teal: "bg-teal-500/10 text-teal-500",
      emerald: "bg-emerald-500/10 text-emerald-500",
      blue: "bg-blue-500/10 text-blue-500",
      violet: "bg-violet-500/10 text-violet-500",
   };

   return (
      <div className="glass-card rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all shadow-lg group">
         <div className="flex items-center justify-between mb-4">
            <div className={cn("p-2 rounded-xl group-hover:scale-110 transition-transform", colorMap[color])}>
               {icon}
            </div>
            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{title}</div>
         </div>
         <div className="space-y-1">
            <div className="text-3xl font-black text-white tracking-tight">{value}</div>
            <div className="text-xs font-bold text-zinc-500">{sub}</div>
         </div>
      </div>
   );
}


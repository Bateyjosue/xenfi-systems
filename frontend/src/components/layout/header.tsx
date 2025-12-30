'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';

export function Header({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-zinc-900/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-zinc-400 hover:text-white transition-colors lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 h-full items-center">
          <div className="flex items-center text-lg font-bold text-white">XenFi Systems</div>
      </div>
    </div>
  );
}

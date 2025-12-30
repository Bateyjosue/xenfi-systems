'use client';

import { Fragment } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import {
  XMarkIcon,
  HomeIcon,
  BanknotesIcon,
  FolderIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Expenses', href: '/expenses', icon: BanknotesIcon },
  { name: 'Categories', href: '/categories', icon: FolderIcon, adminOnly: true },
];

function NavLink({ item, isActive }: { item: any; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        isActive
          ? 'bg-teal-500/10 text-teal-400'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all'
      )}
    >
      <item.icon
        className={cn(
          isActive ? 'text-teal-400' : 'text-zinc-400 group-hover:text-white',
          'h-6 w-6 shrink-0 transition-colors'
        )}
        aria-hidden="true"
      />
      {item.name}
    </Link>
  );
}

export function MobileSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex">
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              
              {/* Sidebar Content */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                   <div className="flex items-center gap-2">
                     <div className="h-8 w-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                       <BanknotesIcon className="h-5 w-5 text-teal-500" />
                     </div>
                     <span className="text-xl font-bold text-white tracking-tight">XenFi</span>
                   </div>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                          if (item.adminOnly && user?.role !== 'ADMIN') return null;
                          return (
                            <li key={item.name}>
                              <NavLink item={item} isActive={pathname === item.href} />
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                    <li className="mt-auto">
                        <button
                            onClick={() => logout()}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full transition-all"
                        >
                            <ArrowLeftOnRectangleIcon
                                className="text-zinc-400 group-hover:text-white h-6 w-6 shrink-0"
                                aria-hidden="true"
                            />
                            Logout
                        </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-950 px-6 pb-4 border-r border-white/5">
        <div className="flex h-16 shrink-0 items-center">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
               <BanknotesIcon className="h-5 w-5 text-teal-500" />
             </div>
             <span className="text-xl font-bold text-white tracking-tight">XenFi Systems</span>
           </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  if (item.adminOnly && user?.role !== 'ADMIN') return null;
                  return (
                    <li key={item.name}>
                      <NavLink item={item} isActive={pathname === item.href} />
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-white min-w-0 mb-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 text-teal-500">
                    <span className="text-xs font-medium">
                        {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                    </span>
                  </div>
                  <span className="truncate text-zinc-300">{user?.name || user?.email}</span>
              </div>
                <button
                    onClick={() => logout()}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full transition-all"
                >
                    <ArrowLeftOnRectangleIcon
                        className="text-zinc-400 group-hover:text-white h-6 w-6 shrink-0"
                        aria-hidden="true"
                    />
                    Logout
                </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

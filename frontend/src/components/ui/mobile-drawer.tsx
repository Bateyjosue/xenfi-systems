"use client";

import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function MobileDrawer({ isOpen, onClose, title, children }: MobileDrawerProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Drawer Panel */}
        <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col overflow-hidden bg-zinc-900 rounded-t-3xl border-t border-white/10 shadow-2xl ring-1 ring-white/10 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-w-lg sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:bottom-auto">
           <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300 sm:duration-200"
            enterFrom="translate-y-full sm:opacity-0 sm:scale-95"
            enterTo="translate-y-0 sm:opacity-100 sm:scale-100"
            leave="transform transition ease-in-out duration-300 sm:duration-200"
            leaveFrom="translate-y-0 sm:opacity-100 sm:scale-100"
            leaveTo="translate-y-full sm:opacity-0 sm:scale-95"
          >
            <Dialog.Panel className="flex flex-col h-full">
              {/* Handle bar for mobile feel */}
              <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-zinc-700 sm:hidden" />

              <div className="px-6 pb-2 pt-4 flex items-center justify-between">
                <Dialog.Title className={clsx("text-lg font-semibold text-white", !title && "sr-only")}>
                  {title || "Modal"}
                </Dialog.Title>
                <button
                  type="button"
                  className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-8">
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

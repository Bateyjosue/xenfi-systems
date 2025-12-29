import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark", // Default to dark mode
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          
          // Immediately update DOM
          if (typeof window !== "undefined") {
            const html = document.documentElement;
            const body = document.body;
            
            // Remove old classes
            html.classList.remove('light', 'dark');
            body.classList.remove('bg-gray-900', 'text-gray-100', 'bg-white', 'text-gray-900');
            
            // Add new classes
            html.classList.add(newTheme);
            if (newTheme === 'dark') {
              body.classList.add('bg-gray-900', 'text-gray-100');
            } else {
              body.classList.add('bg-white', 'text-gray-900');
            }
          }
          
          return { theme: newTheme };
        });
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const html = document.documentElement;
          const body = document.body;
          
          // Apply theme immediately on hydration
          html.classList.remove('light', 'dark');
          body.classList.remove('bg-gray-900', 'text-gray-100', 'bg-white', 'text-gray-900');
          
          html.classList.add(state.theme);
          if (state.theme === 'dark') {
            body.classList.add('bg-gray-900', 'text-gray-100');
          } else {
            body.classList.add('bg-white', 'text-gray-900');
          }
        }
      },
    }
  )
);

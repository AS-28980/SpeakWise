import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("speakwise-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("speakwise-theme", theme);
    set({ theme });
  },
}));
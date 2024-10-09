import {create} from "zustand";

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const useTheme = create<ThemeState>((set) => ({
    darkMode: JSON.parse(localStorage.getItem("darkMode")!) || false, 
    toggleDarkMode: () =>
      set((state) => {
        const newMode = !state.darkMode;
        localStorage.setItem("darkMode", JSON.stringify(newMode)); 
        return { darkMode: newMode };
      }),
}));

export default useTheme;

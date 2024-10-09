import { create } from "zustand";
interface User {
  name: string;
  email: string;
}
interface AuthState {
  accessToken: string|null;
  user: User|null;
  setAccessToken: (token: string) => void;
  setUserData: (userData: User) => void;
  logout: () => void;
}
const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token: string) => set({ accessToken: token }),
  setUserData: (userData: User) => set({ user: userData }),
  logout: () => set({ accessToken: null, user: null }),
}));

export default useAuthStore;

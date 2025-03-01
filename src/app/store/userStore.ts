import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  user: {
    username?: string;
    userId?: number;
    avatarUrl?: string;
    is_author?: string;
  } | null;
  token: string | null;
  login: (userData: {
    username?: string;
    token: string;
    avatarUrl?: string;
  }) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (userData) => {
        set({ user: userData, token: userData.token });
      },
      logout: () => {
        set({ user: null, token: null });
        const storage = createJSONStorage(() => sessionStorage); // 改为 sessionStorage
        storage.removeItem("user-storage");
      },
    }),
    {
      name: "user-storage", // 持久化存储的名称
      storage: createJSONStorage(() => sessionStorage), // 使用 sessionStorage
    }
  )
);

export default useUserStore;

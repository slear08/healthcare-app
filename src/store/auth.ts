import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Role = 'USER' | 'ADMIN';

interface User {
    username: string;
    role: Role;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, role: Role) => boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (username, role) => {
                set({
                    user: { username, role },
                    isAuthenticated: true,
                });
                return true;
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                });
                console.log('logout');
                localStorage.removeItem('auth-storage');
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

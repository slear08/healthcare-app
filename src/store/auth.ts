import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Role = 'USER' | 'ADMIN';

interface User {
    username: string;
    role: Role;
    profile?: string;
    mobileNumber?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, role: Role, profile?: string, mobileNumber?: string) => boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (username, role, profile, mobileNumber) => {
                set({
                    user: { username, role, profile, mobileNumber },
                    isAuthenticated: true,
                });
                return true;
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                });
                localStorage.removeItem('auth-storage');
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

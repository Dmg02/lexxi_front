import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

const AuthContext = createContext<{
    user: User | null;
    login: (values: TValue) => Promise<void>;
    logout: () => Promise<void>;
    isAuthChecked: boolean;
}>(null);

export const useAuth = () => useContext(AuthContext);

type TValue = any

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthChecked, setAuthChecked] = useState(false);
    const router = useRouter();

    const login = async (values: TValue) => {
        const rs = await createSupabaseClientSide().auth.signInWithPassword({ email: values.email, password: values.password });
        const { error, data } = rs;

        if (error) {
            console.log(error);
            return;
        };

        setUser(data.user);
        setAuthChecked(true);
        router.push('/')
    };

    const logout = async () => {
        setUser(null);
        router.push('/login');
    };

    useEffect(() => {

        const checkUser = async () => {
            const { data, error } = await createSupabaseClientSide().auth.getUser();

            if (!error) {
                setUser(data.user);
            } else {
                router.push('/login');
            }

            setAuthChecked(true);
        }

        if (!user && isAuthChecked) {
            router.push('/login');
        } else {
            checkUser()
        }

     }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthChecked }}>{children}</AuthContext.Provider>
    );
};

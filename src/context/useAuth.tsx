import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

type TValue = any

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isAuthChecked, setAuthChecked] = useState(false);
    const router = useRouter();

    const login = async (values: TValue) => {
        const { error, data } = await createSupabaseClientSide().auth.signInWithPassword({ email: values.email, password: values.password });

        if (!error) {
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

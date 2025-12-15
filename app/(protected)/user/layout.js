// app/(protected)/layout.js
'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { useLayoutEffect } from "react";
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Protected({ children }) {
    const { user, loading } = useAuth();
    const returnUrl = usePathname();

    useLayoutEffect(() => {
        // Jeśli ładowanie zakończone i brak użytkownika -> przekieruj
        if (!loading && !user) {
            redirect(`/user/signin?returnUrl=${returnUrl}`);
        }
    }, [user, loading, returnUrl]);

    // Jeśli trwa ładowanie lub brak użytkownika, nie pokazuj treści chronionej
    if (loading || !user) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-indigo-600">Sprawdzanie uprawnień...</div>
            </div>
        );
    }

    // Jeśli jest użytkownik, wyświetl treść
    return <>{children}</>;
}
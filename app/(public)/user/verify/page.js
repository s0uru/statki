'use client';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    // Pobieramy email z URL, ponieważ po wylogowaniu auth.currentUser będzie null
    const email = searchParams.get('email'); 

    useEffect(() => {
        // Upewniamy się, że użytkownik jest wylogowany na tej stronie
        signOut(auth).catch((err) => console.error("Błąd wylogowania:", err));
    }, []);

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-indigo-600 mb-4">Weryfikacja wymagana</h1>
            <p className="text-gray-700 mb-6">
                Twoje konto zostało utworzone, ale adres email nie został jeszcze zweryfikowany.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                    Sprawdź skrzynkę odbiorczą dla adresu: <strong>{email}</strong>
                    <br />i kliknij w link weryfikacyjny.
                </p>
            </div>
            <Link 
                href="/user/signin"
                className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
                Powrót do logowania
            </Link>
        </div>
    );
}
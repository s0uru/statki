'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase'; // Twój import auth
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Walidacja haseł
    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne.');
      return;
    }

    try {
      // 1. Tworzenie użytkownika
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered!", user);

      // 2. Wysyłanie weryfikacji email
      await sendEmailVerification(user);
      console.log("Email verification sent!");

      // 3. Wylogowanie (bo Firebase loguje automatycznie po rejestracji)
      await signOut(auth);

      // 4. Przekierowanie na stronę weryfikacji z przekazaniem emaila w parametrze
      router.push(`/user/verify?email=${encodeURIComponent(email)}`);

    } catch (err) {
      // Zadanie 6: Obsługa błędu zajętego emaila
      if (err.code === 'auth/email-already-in-use') {
          setError('Ten email jest już zajęty. Użyj innego adresu.');
      } else if (err.code === 'auth/weak-password') {
          setError('Hasło jest za słabe (min. 6 znaków).');
      } else {
          setError('Błąd: ' + err.message);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Utwórz nowe konto
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Warunkowe renderowanie błędu */}
        {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 border border-red-200" role="alert">
                {error}
            </div>
        )}
        
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Adres email</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" required className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Hasło</label>
            <div className="mt-2">
              <input id="password" name="password" type="password" required className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          {/* Nowe pole: Powtórz hasło */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">Powtórz hasło</label>
            <div className="mt-2">
              <input id="confirmPassword" name="confirmPassword" type="password" required className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500">Zarejestruj się</button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Masz już konto? <Link href="/user/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
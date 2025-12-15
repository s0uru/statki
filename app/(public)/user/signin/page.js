'use client';
import { useState, Suspense } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, signOut } from "firebase/auth";
import { auth } from '@/app/lib/firebase';
import { useSearchParams, useRouter } from "next/navigation";
import Link from 'next/link';

function SignInFormContent() {
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl");

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    setPersistence(auth, browserSessionPersistence)
    .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
    })
    .then((userCredential) => {
        if (!userCredential.user.emailVerified) {
            signOut(auth);
            router.push(`/user/verify?email=${encodeURIComponent(email)}`);
            return;
        }

        if (returnUrl) {
            router.push(returnUrl);
        } else {
            router.push('/');
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
             setError("Błędny email lub hasło.");
        } else {
             setError("Wystąpił błąd logowania: " + error.message);
        }
    });
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Zaloguj się do konta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700" role="alert">
                {error}
            </div>
        )}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Adres email</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Hasło</label>
            </div>
            <div className="mt-2">
              <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Zaloguj się
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Nie masz konta? <Link href="/user/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Zarejestruj się tutaj</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInForm() {
    return (
        <Suspense fallback={<div className="text-center p-10">Ładowanie formularza...</div>}>
            <SignInFormContent />
        </Suspense>
    );
}
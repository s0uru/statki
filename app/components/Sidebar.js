'use client';
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-72 flex-col border-r border-gray-200 bg-white shadow-sm sm:flex">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100 px-6">
         <h1 className="text-2xl font-black uppercase tracking-wider text-indigo-600">
           Statki<span className="text-gray-400">.io</span>
         </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Strona główna
              </Link>
            </li>
            
            <li>
              <div className="my-4 h-px bg-gray-100"></div> {/* Separator */}
              <span className="px-4 text-xs font-semibold uppercase text-gray-400">Użytkownik</span>
            </li>

            <li>
              <Link
                href="/user/profile"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Twój Profil
              </Link>
            </li>

            <li>
              <Link
                href="/user/signout"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Wyloguj się
              </Link>
            </li>
        </ul>
      </nav>
      
      {/* Stopka sidebara z danymi użytkownika (Zadanie 5) */}
      <div className="border-t border-gray-100 p-4">
        {user ? (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                {user.photoURL ? (
                    <img 
                        src={user.photoURL} 
                        alt="Avatar" 
                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => e.target.style.display = 'none'} // Zabezpieczenie przed złym linkiem
                    />
                ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                        {/* Pierwsza litera emaila lub nazwy */}
                        {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                    </div>
                )}
                
                <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium text-gray-900">
                        {user.displayName || 'Użytkownik'}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                        {user.email}
                    </p>
                </div>
            </div>
        ) : (
            <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-xs text-gray-500">Zalogowany jako gość</p>
                <Link href="/user/signin" className="mt-2 block text-xs font-semibold text-indigo-600 hover:underline">
                    Zaloguj się
                </Link>
            </div>
        )}
      </div>
    </aside>
  );
}
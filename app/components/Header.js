// app/components/Header.js
'use client';
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";

export default function Header() {
  const { user } = useAuth(); // Sprawdzamy stan zalogowania

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-8 backdrop-blur-md flex-shrink-0">
      <div className="text-lg font-bold text-slate-700 sm:hidden">Statki App</div>
      <div className="hidden text-sm font-medium text-slate-500 sm:block">Laboratorium</div>

      <div className="flex items-center gap-4">
        {user ? (
          /* WIDOK DLA ZALOGOWANEGO: Tylko przycisk Wyloguj */
          <Link
            href="/user/signout"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            Wyloguj
          </Link>
        ) : (
          /* WIDOK DLA GOŚCIA: Logowanie i Rejestracja */
          <>
            <Link
              href="/user/signin"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Logowanie
            </Link>
            <Link
              href="/user/register"
              className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Rejestracja
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
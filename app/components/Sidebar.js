'use client';
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const getLinkClass = (path) => {
    const isActive = pathname === path;
    const baseClass = "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition";
    const activeClass = "bg-indigo-100 text-indigo-800 shadow-sm"; 
    const inactiveClass = "text-slate-600 hover:bg-slate-200 hover:text-slate-900"; 

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-50 shadow-sm sm:flex">
      <div className="flex h-20 items-center justify-center border-b border-slate-200 px-6">
         <h1 className="text-2xl font-black uppercase tracking-wider text-indigo-700">
           Statki<span className="text-slate-400">.io</span>
         </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-2">
            <li>
              <Link href="/" className={getLinkClass('/')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Strona główna
              </Link>
            </li>

            {/* POPRAWIONY LINK: /user/about zamiast /about */}
            <li>
              <Link href="/user/about" className={getLinkClass('/user/about')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                O projekcie
              </Link>
            </li>
            
            {user && (
              <>
                <li>
                  <div className="my-4 h-px bg-slate-200"></div>
                  <span className="px-4 text-xs font-semibold uppercase text-slate-400">Użytkownik</span>
                </li>

                <li>
                  <Link href="/user/game" className={getLinkClass('/user/game')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                    Gra
                  </Link>
                </li>

                <li>
                  <Link href="/user/leaderboard" className={getLinkClass('/user/leaderboard')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v7.5" />
                    </svg>
                    Ranking
                  </Link>
                </li>

                <li>
                  <Link href="/user/profile" className={getLinkClass('/user/profile')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Twój Profil
                  </Link>
                </li>

                <li>
                  <Link href="/user/articles" className={getLinkClass('/user/articles')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Artykuły
                  </Link>
                </li>

                <li>
                  <Link href="/user/signout" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Wyloguj się
                  </Link>
                </li>
              </>
            )}
        </ul>
      </nav>
      
      <div className="border-t border-slate-200 p-4">
        {user ? (
            <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3">
                {user.photoURL ? (
                    <img 
                        src={user.photoURL} 
                        alt="Avatar" 
                        className="h-10 w-10 rounded-full object-cover border border-slate-300"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold border border-indigo-300">
                        {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                    </div>
                )}
                
                <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium text-slate-900">
                        {user.displayName || 'Użytkownik'}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                        {user.email}
                    </p>
                </div>
            </div>
        ) : (
            <div className="rounded-lg bg-slate-100 p-4 text-center">
                <p className="text-xs text-slate-500">Zalogowany jako gość</p>
                <Link href="/user/signin" className="mt-2 block text-xs font-semibold text-indigo-700 hover:underline">
                    Zaloguj się
                </Link>
            </div>
        )}
      </div>
    </aside>
  );
}
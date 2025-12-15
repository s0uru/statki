import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">
      
      {/* --- HERO SECTION --- */}
      <section className="rounded-3xl bg-indigo-600 px-4 py-16 text-center text-white shadow-xl sm:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Bitwa Morska Online
          </h1>
          <p className="mt-6 text-lg text-indigo-100 sm:text-xl">
            Klasyczna gra w statki w nowoczesnym wydaniu. Zaloguj się, ustaw swoją flotę i zmierz się z przeciwnikiem w technologii Next.js i Firebase.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/user/register"
              className="rounded-full bg-white px-8 py-3 text-sm font-bold text-indigo-600 transition hover:bg-gray-100 focus:outline-none focus:ring focus:ring-yellow-400"
            >
              Zacznij Grać
            </Link>
            <Link
              href="/user/signin"
              className="rounded-full border border-white px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring focus:ring-white"
            >
              Zaloguj się
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Karta 1 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition hover:shadow-xl">
            <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Bezpieczeństwo</h3>
            <p className="mt-2 text-gray-500">
              Pełna autoryzacja użytkowników oparta na Firebase Auth. Twoje dane są bezpieczne i szyfrowane.
            </p>
          </div>

          {/* Karta 2 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition hover:shadow-xl">
            <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Rozgrywka</h3>
            <p className="mt-2 text-gray-500">
              Intuicyjny interfejs do ustawiania statków (Drag & Drop) oraz płynna mechanika gry.
            </p>
          </div>

          {/* Karta 3 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition hover:shadow-xl">
            <div className="mb-4 inline-block rounded-lg bg-green-100 p-3 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Responsywność</h3>
            <p className="mt-2 text-gray-500">
              Aplikacja działa świetnie na komputerach, tabletach i smartfonach dzięki Tailwind CSS.
            </p>
          </div>
          
        </div>
      </section>
    </div>
  );
}
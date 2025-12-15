// app/about/page.js (lub app/user/about/page.js - zależy gdzie ostatecznie utworzyłeś plik)
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* --- NAGŁÓWEK --- */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">O Projekcie</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Projekt edukacyjny demonstracyjny, łączący nowoczesny frontend Next.js z chmurowym backendem Firebase.
        </p>
      </div>

      {/* --- GŁÓWNA KARTA --- */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-8">
        
        {/* Sekcja: Cel */}
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Cel Aplikacji</h2>
            <p className="text-slate-600 leading-relaxed">
              Aplikacja powstała w ramach laboratorium programowania aplikacji internetowych. 
              Głównym celem było stworzenie w pełni funkcjonalnej gry przeglądarkowej "Statki" (Battleship), 
              która obsługuje uwierzytelnianie użytkowników, zapisuje historię rozgrywek w czasie rzeczywistym 
              i oferuje responsywny interfejs dostosowany do urządzeń mobilnych i desktopowych.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sekcja: Technologie */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Technologie
                </h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Framework</span> <span className="font-medium text-slate-800">Next.js 15 (App Router)</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Styling</span> <span className="font-medium text-slate-800">Tailwind CSS</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Auth & Database</span> <span className="font-medium text-slate-800">Firebase</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Hosting</span> <span className="font-medium text-slate-800">Vercel / Firebase Hosting</span>
                    </li>
                </ul>
            </div>

            {/* Sekcja: Funkcjonalności */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Funkcjonalności
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm marker:text-indigo-300">
                    <li>Logowanie i Rejestracja (Firebase Auth)</li>
                    <li>Edycja profilu użytkownika</li>
                    <li>Globalny Ranking graczy</li>
                    <li>Mechanika gry Singleplayer (PvE)</li>
                    <li>Responsywność (RWD)</li>
                </ul>
            </div>
        </div>

        {/* Sekcja: Zasady Gry */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Zasady Rozgrywki</h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm space-y-2">
            <p>
                <strong>Cel gry:</strong> Zatopienie całej floty przeciwnika przed utratą własnych statków.
            </p>
            <p>
                <strong>Flota składa się z:</strong>
            </p>
            <ul className="list-disc list-inside ml-2 text-slate-600">
                <li>1x Czteromasztowiec (4 kratki)</li>
                <li>2x Trzymasztowiec (3 kratki)</li>
                <li>3x Dwumasztowiec (2 kratki)</li>
                <li>4x Jednomasztowiec (1 kratka)</li>
            </ul>
            <p className="text-xs text-slate-500 mt-2 italic">
                * Statki są rozmieszczane losowo. Pamiętaj, że statki nie mogą stykać się ze sobą bokami ani rogami.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/app/lib/AuthContext";
import Sidebar from "@/app/components/Sidebar"; // Importujemy nowy komponent

export const metadata = {
  title: "Statki - Laboratorium",
  description: "Projekt na laboratoria Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="h-full bg-gray-50">
      <body className="flex h-full text-gray-800 antialiased">
        
        {/* AuthProvider musi otaczać wszystko, co korzysta z useAuth (w tym Sidebar) */}
        <AuthProvider>
            
            {/* --- SIDEBAR (Nowy komponent) --- */}
            <Sidebar />

            {/* --- MAIN WRAPPER --- */}
            <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
              
              {/* HEADER (Sticky) */}
              <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-md">
                <div className="text-lg font-bold text-gray-700 sm:hidden">Statki App</div> 
                <div className="hidden text-sm font-medium text-gray-500 sm:block">Laboratorium</div>
                
                <div className="flex items-center gap-4">
                  <Link
                    href="/user/signin"
                    className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
                  >
                    Logowanie
                  </Link>
                  <Link
                    href="/user/register"
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
                  >
                    Rejestracja
                  </Link>
                </div>
              </header>

              {/* MAIN CONTENT AREA */}
              <main className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-7xl">
                      {children}
                </div>
              </main>
            </div>

        </AuthProvider>
        
      </body>
    </html>
  );
}
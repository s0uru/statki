// app/layout.js
import "./globals.css";
import { AuthProvider } from "@/app/lib/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header"; // <--- 1. Importujemy nowy Header

export const metadata = {
  title: "Statki - Laboratorium",
  description: "Projekt na laboratoria Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="h-full bg-slate-100">
      <body className="flex h-full text-slate-800 antialiased">
        
        <AuthProvider>
            
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden bg-slate-100">
              
              {/* <--- 2. Tutaj używamy komponentu Header (zamiast wpisywać kod HTML ręcznie) */}
              <Header />

              <main className="flex-1 overflow-y-auto flex flex-col">
                <div className="flex-grow p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </div>

                <Footer />
              </main>
            </div>

        </AuthProvider>
        
      </body>
    </html>
  );
}
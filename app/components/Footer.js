// app/components/Footer.js
export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 py-2 text-center">
      <p className="text-[10px] text-gray-400">
        &copy; {new Date().getFullYear()} Statki App. 
        <span className="hidden sm:inline mx-2">|</span>
        <span className="block sm:inline">
            Autor projektu: <span className="font-bold text-gray-600">Jakub Pietrusiak</span>
        </span>
      </p>
    </footer>
  );
}
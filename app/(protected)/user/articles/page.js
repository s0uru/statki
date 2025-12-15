'use client';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '@/app/lib/firebase';
import { useAuth } from '@/app/lib/AuthContext';

export default function ArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Pobieranie artykułów
  useEffect(() => {
    if (!user) return;

    const fetchArticles = async () => {
      try {
        // Zapytanie: pobierz artykuły, gdzie pole 'user' równa się ID zalogowanego użytkownika
        const q = query(collection(db, "articles"), where("user", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const articlesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setArticles(articlesData);
      } catch (error) {
        console.error("Błąd pobierania artykułów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user]);

  // Dodawanie artykułu
  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      // Dodajemy dokument do kolekcji 'articles'
      const docRef = await addDoc(collection(db, "articles"), {
        title: newTitle,
        user: user.uid, // Ważne: przypisujemy artykuł do usera
        createdAt: serverTimestamp()
      });
      
      // Aktualizujemy widok bez odświeżania strony
      setArticles([...articles, { id: docRef.id, title: newTitle, user: user.uid }]);
      setNewTitle('');
    } catch (error) {
      console.error("Błąd dodawania:", error);
      alert("Błąd dodawania: " + error.message);
    }
  };

  if (!user) return null; // Zabezpieczenie (layout protected i tak przekieruje)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Moje Artykuły</h1>

      {/* Formularz dodawania */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Dodaj nowy wpis</h2>
        <form onSubmit={handleAddArticle} className="flex gap-4">
          <input 
            type="text" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Tytuł artykułu..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button type="submit" className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
            Dodaj
          </button>
        </form>
      </div>

      {/* Lista artykułów */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
            <p className="text-gray-500">Ładowanie danych...</p>
        ) : articles.length > 0 ? (
            articles.map((article) => (
                <div key={article.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                    <h3 className="font-bold text-lg text-gray-800">{article.title}</h3>
                    <p className="text-xs text-gray-400 mt-2">ID: {article.id}</p>
                </div>
            ))
        ) : (
            <p className="text-gray-500 col-span-full text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                Brak artykułów. Dodaj pierwszy powyżej!
            </p>
        )}
      </div>
    </div>
  );
}
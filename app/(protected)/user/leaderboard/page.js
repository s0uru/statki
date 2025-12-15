// app/(protected)/user/leaderboard/page.js
'use client';
import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Pobieramy historię gier
        // W produkcyjnej apce lepiej mieć osobną kolekcję 'users_stats', 
        // ale do tego projektu wystarczy agregacja po stronie klienta.
        const q = query(collection(db, "games"), orderBy("date", "desc"), limit(100));
        const querySnapshot = await getDocs(q);

        const stats = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const email = data.userEmail || 'Anonim'; // Fallback jeśli stare dane nie mają maila
          
          if (!stats[email]) {
            stats[email] = { wins: 0, total: 0, hits: 0, shots: 0, email: email };
          }

          stats[email].total += 1;
          if (data.result === 'win') stats[email].wins += 1;
          
          // Dodajemy statystyki celności (jeśli istnieją w rekordzie)
          stats[email].hits += data.hits || 0;
          stats[email].shots += data.shots || 0;
        });

        // Konwersja obiektu na tablicę i obliczanie procentów
        const leaderboardArray = Object.values(stats).map(player => {
            const accuracy = player.shots > 0 ? (player.hits / player.shots) * 100 : 0;
            const winRate = player.total > 0 ? (player.wins / player.total) * 100 : 0;
            return {
                ...player,
                accuracy: accuracy.toFixed(1),
                winRate: winRate.toFixed(1)
            };
        });

        // Sortowanie: Najpierw wg liczby wygranych, potem wg celności
        leaderboardArray.sort((a, b) => {
            if (b.wins !== a.wins) return b.wins - a.wins;
            return b.accuracy - a.accuracy;
        });

        setLeaders(leaderboardArray);
      } catch (error) {
        console.error("Błąd pobierania rankingu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-indigo-900 uppercase tracking-wider">Tablica Wyników</h1>
        <p className="text-gray-500 mt-2">Najlepsi admirałowie floty</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-10 text-center text-gray-500">Ładowanie danych...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-indigo-50 text-indigo-900 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">Gracz</th>
                            <th className="px-6 py-4 text-center">Wygrane</th>
                            <th className="px-6 py-4 text-center">Mecze</th>
                            <th className="px-6 py-4 text-center">Celność</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leaders.length === 0 ? (
                            <tr><td colSpan="5" className="p-6 text-center text-gray-500">Brak rozegranych gier.</td></tr>
                        ) : (
                            leaders.map((player, index) => (
                                <tr key={player.email} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-400">
                                        {index === 0 && <span className="text-yellow-500 text-xl mr-1">🥇</span>}
                                        {index === 1 && <span className="text-gray-400 text-xl mr-1">🥈</span>}
                                        {index === 2 && <span className="text-orange-400 text-xl mr-1">🥉</span>}
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {player.email.split('@')[0]}
                                    </td>
                                    <td className="px-6 py-4 text-center text-green-600 font-bold bg-green-50/50">
                                        {player.wins}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-500">
                                        {player.total}
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-sm">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-indigo-500" 
                                                    style={{ width: `${player.accuracy}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-indigo-700 font-bold">{player.accuracy}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}
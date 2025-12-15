'use client';

export default function Board({ boardData, onCellClick, isEnemy = false }) {
  // boardData to tablica 10x10, gdzie:
  // 0 = puste
  // 1 = statek (widoczny tylko dla gracza)
  // 2 = pudło (miss)
  // 3 = trafienie (hit)

  return (
    <div className="grid grid-cols-10 gap-1 border-2 border-gray-800 bg-blue-100 p-1">
      {boardData.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          
          let cellStyle = "bg-white hover:bg-blue-200 cursor-pointer"; // domyślny styl
          
          if (cell === 2) cellStyle = "bg-gray-400"; // pudło
          if (cell === 3) cellStyle = "bg-red-500"; // trafienie
          
          // Jeśli to plansza gracza (nie wroga), pokazujemy statki
          if (!isEnemy && cell === 1) cellStyle = "bg-indigo-600"; 

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center border border-blue-200 text-xs font-bold transition-colors ${cellStyle}`}
            >
              {cell === 2 && "•"}
              {cell === 3 && "X"}
            </div>
          );
        })
      )}
    </div>
  );
}
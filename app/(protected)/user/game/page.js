// app/(protected)/user/game/page.js
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/app/lib/AuthContext';
import { useRouter } from 'next/navigation';

// --- KONFIGURACJA STATKÓW ---
const SHIPS_CONFIG = [
  { size: 4, name: 'Czteromasztowiec' },
  { size: 3, name: 'Trzymasztowiec' },
  { size: 2, name: 'Dwumasztowiec' },
  { size: 2, name: 'Dwumasztowiec' },
  { size: 1, name: 'Jednomasztowiec' },
  { size: 1, name: 'Jednomasztowiec' },
  { size: 1, name: 'Jednomasztowiec' },
];

const BOARD_SIZE = 10;

export default function GamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/signin');
    }
  }, [user, loading, router]);

  // Tworzenie pustej planszy
  const createEmptyBoard = () => 
    Array(BOARD_SIZE * BOARD_SIZE).fill(null).map(() => ({ status: 'empty', hasShip: false, shipId: null }));

  // --- STANY GRY ---
  const [playerBoard, setPlayerBoard] = useState(createEmptyBoard());
  const [enemyBoard, setEnemyBoard] = useState(createEmptyBoard());
  const [gameState, setGameState] = useState('setup'); // setup, playing, won, lost
  const [turn, setTurn] = useState('player');
  const [logs, setLogs] = useState(['Ustaw swoje statki, aby rozpocząć bitwę!']);
  const [botHitsStack, setBotHitsStack] = useState([]);
  const [gameStats, setGameStats] = useState({ shots: 0, hits: 0 });

  // --- STANY SETUPU ---
  const [shipsToPlace, setShipsToPlace] = useState([...SHIPS_CONFIG]);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [hoveredCells, setHoveredCells] = useState([]);

  const isValidIndex = (row, col) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

  const getNeighbors = (index) => {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const neighbors = [];
    [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]].forEach(([r, c]) => {
      if (isValidIndex(r, c)) neighbors.push(r * BOARD_SIZE + c);
    });
    return neighbors;
  };

  const canPlaceShip = (board, row, col, size, horizontal) => {
    // Sprawdź czy mieści się na planszy
    if (horizontal) { if (col + size > BOARD_SIZE) return false; } 
    else { if (row + size > BOARD_SIZE) return false; }

    // Sprawdź kolizje i odstępy (1 kratka)
    const startRow = Math.max(0, row - 1);
    const endRow = Math.min(BOARD_SIZE - 1, row + (horizontal ? 1 : size));
    const startCol = Math.max(0, col - 1);
    const endCol = Math.min(BOARD_SIZE - 1, col + (horizontal ? size : 1));

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        if (board[r * BOARD_SIZE + c].hasShip) return false;
      }
    }
    return true;
  };

  const placeShip = (board, row, col, size, horizontal, shipId) => {
    for (let i = 0; i < size; i++) {
      const idx = horizontal ? row * BOARD_SIZE + col + i : (row + i) * BOARD_SIZE + col;
      board[idx] = { ...board[idx], hasShip: true, shipId: shipId };
    }
  };

  // --- LOGIKA SETUPU (RĘCZNE I LOSOWE) ---

  const handleSetupCellClick = (index) => {
    if (shipsToPlace.length === 0) return;

    const currentShip = shipsToPlace[0];
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;

    if (canPlaceShip(playerBoard, row, col, currentShip.size, isHorizontal)) {
      const newBoard = [...playerBoard];
      const shipId = `${currentShip.name}-${SHIPS_CONFIG.length - shipsToPlace.length}`;
      placeShip(newBoard, row, col, currentShip.size, isHorizontal, shipId);
      setPlayerBoard(newBoard);
      setShipsToPlace(prev => prev.slice(1));
    } else {
        addLog("Nie można tu postawić statku! Zachowaj odstęp.");
    }
  };

  const handleSetupHover = (index) => {
    if (shipsToPlace.length === 0) {
        setHoveredCells([]);
        return;
    }
    const currentShip = shipsToPlace[0];
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const size = currentShip.size;
    
    let cells = [];
    if (isHorizontal) {
        if (col + size <= BOARD_SIZE) {
            for(let i=0; i<size; i++) cells.push(row * BOARD_SIZE + col + i);
        }
    } else {
        if (row + size <= BOARD_SIZE) {
            for(let i=0; i<size; i++) cells.push((row + i) * BOARD_SIZE + col);
        }
    }
    setHoveredCells(cells);
  };

  const resetSetup = () => {
    setPlayerBoard(createEmptyBoard());
    setShipsToPlace([...SHIPS_CONFIG]);
    setLogs(['Zresetowano planszę. Ustaw statki ponownie.']);
  };

  const randomizePlayerBoard = () => {
    setPlayerBoard(generateRandomBoard());
    setShipsToPlace([]);
    setLogs(['Statki rozlosowane. Gotowy do walki?']);
  };

  const generateRandomBoard = () => {
    let newBoard = createEmptyBoard();
    for (let i = 0; i < SHIPS_CONFIG.length; i++) {
        const ship = SHIPS_CONFIG[i];
        let placed = false;
        let attempts = 0;
        const shipId = `${ship.name}-${i}`;
        while (!placed && attempts < 200) {
            attempts++;
            const horizontal = Math.random() < 0.5;
            const randomIdx = Math.floor(Math.random() * (BOARD_SIZE * BOARD_SIZE));
            const row = Math.floor(randomIdx / BOARD_SIZE);
            const col = randomIdx % BOARD_SIZE;
            if (canPlaceShip(newBoard, row, col, ship.size, horizontal)) {
                placeShip(newBoard, row, col, ship.size, horizontal, shipId);
                placed = true;
            }
        }
        if (!placed) return generateRandomBoard(); // Retry recursion
    }
    return newBoard;
  };

  // --- LOGIKA GRY ---

  const startGame = () => {
    if (shipsToPlace.length > 0) {
        addLog("Musisz ustawić wszystkie statki przed rozpoczęciem!");
        return;
    }
    setEnemyBoard(generateRandomBoard());
    setGameState('playing');
    setTurn('player');
    setBotHitsStack([]);
    setGameStats({ shots: 0, hits: 0 });
    setLogs(['Bitwa rozpoczęta! Twój ruch.']);
  };

  const countEnemyShipsLeft = () => {
    const uniqueShips = new Set();
    enemyBoard.forEach(cell => {
        if (cell.hasShip && cell.status !== 'sunk') {
            uniqueShips.add(cell.shipId);
        }
    });
    return uniqueShips.size;
  };

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const checkAndMarkSunk = (board, shipId) => {
    const shipIndices = board.map((cell, idx) => (cell.shipId === shipId ? idx : null)).filter((idx) => idx !== null);
    const allHit = shipIndices.every(idx => board[idx].status === 'hit' || board[idx].status === 'sunk');
    if (allHit) {
        shipIndices.forEach(idx => board[idx].status = 'sunk');
        return true;
    }
    return false;
  };

  const handlePlayerMove = (index) => {
    if (gameState !== 'playing' || turn !== 'player') return;
    if (enemyBoard[index].status !== 'empty' && enemyBoard[index].status !== 'ship') return;

    setGameStats(prev => ({ ...prev, shots: prev.shots + 1 }));
    const newEnemyBoard = [...enemyBoard];
    const cell = newEnemyBoard[index];
    
    if (cell.hasShip) {
      setGameStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      cell.status = 'hit';
      const isSunk = checkAndMarkSunk(newEnemyBoard, cell.shipId);
      addLog(isSunk ? "TRAFIENIE I ZATOPIENIE! Masz dodatkowy ruch." : "Trafienie! Masz dodatkowy ruch.");
      setEnemyBoard(newEnemyBoard);
      checkWinCondition(newEnemyBoard, 'player');
    } else {
      cell.status = 'miss';
      addLog("Pudło.");
      setEnemyBoard(newEnemyBoard);
      setTurn('enemy');
    }
  };

  useEffect(() => {
    if (turn === 'enemy' && gameState === 'playing') {
      const timeout = setTimeout(() => makeBotMove(), 1000);
      return () => clearTimeout(timeout);
    }
  }, [turn, gameState, playerBoard]);

  const makeBotMove = () => {
    let targetIndex;
    let newPlayerBoard = [...playerBoard];
    
    if (botHitsStack.length > 0) {
        let potentialTargets = [];
        botHitsStack.forEach(hitIndex => {
            const neighbors = getNeighbors(hitIndex);
            potentialTargets.push(...neighbors.filter(nIdx => newPlayerBoard[nIdx].status === 'empty'));
        });
        if (potentialTargets.length > 0) {
            const uniqueTargets = [...new Set(potentialTargets)];
            targetIndex = uniqueTargets[Math.floor(Math.random() * uniqueTargets.length)];
        }
    }

    if (targetIndex === undefined) {
        let availableMoves = newPlayerBoard.map((cell, idx) => cell.status === 'empty' ? idx : null).filter(idx => idx !== null);
        if (availableMoves.length === 0) return;
        targetIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    const cell = newPlayerBoard[targetIndex];
    if (cell.hasShip) {
        cell.status = 'hit';
        const newBotHits = [...botHitsStack, targetIndex];
        const isSunk = checkAndMarkSunk(newPlayerBoard, cell.shipId);
        
        if (isSunk) {
            addLog("Wróg zatopił Twój statek! Ma kolejny ruch.");
            setBotHitsStack(newBotHits.filter(idx => newPlayerBoard[idx].shipId !== cell.shipId));
        } else {
            addLog("Wróg trafił Twój statek! Ma kolejny ruch.");
            setBotHitsStack(newBotHits);
        }
        setPlayerBoard(newPlayerBoard);
        checkWinCondition(newPlayerBoard, 'enemy');
    } else {
        cell.status = 'miss';
        addLog("Wróg spudłował.");
        setPlayerBoard(newPlayerBoard);
        setTurn('player');
    }
  };

  const checkWinCondition = (board, whoJustMoved) => {
    const hasShipsLeft = board.some(cell => cell.hasShip && cell.status !== 'hit' && cell.status !== 'sunk');
    if (!hasShipsLeft) {
      const winner = whoJustMoved;
      setGameState(winner === 'player' ? 'won' : 'lost');
      addLog(winner === 'player' ? "ZWYCIĘSTWO!" : "PORAŻKA!");
      if (winner === 'player') saveGameResult(true);
      else saveGameResult(false);
      return true;
    }
    return false;
  };

  const saveGameResult = async (isWin) => {
    if (!user) return;
    try {
      const currentStats = { ...gameStats };
      if (isWin) {
         currentStats.shots += 1;
         currentStats.hits += 1;
      }
      await addDoc(collection(db, "games"), {
        user: user.uid,
        userEmail: user.email,
        result: isWin ? 'win' : 'loss',
        date: serverTimestamp(),
        hits: currentStats.hits,
        shots: currentStats.shots,
        type: 'singleplayer'
      });
    } catch (err) { console.error(err); }
  };

  const renderCell = (cell, index, isEnemy) => {
    let bg = "bg-blue-50"; 
    let content = null;
    let cursor = "cursor-default";

    // Style dla setupu
    if (gameState === 'setup' && !isEnemy) {
        cursor = "cursor-pointer";
        if (hoveredCells.includes(index)) bg = "bg-green-200";
        if (cell.hasShip) bg = "bg-gray-500";
    }

    // Style dla gry
    if (gameState !== 'setup') {
        cursor = isEnemy ? "cursor-pointer hover:bg-blue-200" : "cursor-default";
        if (!isEnemy && cell.hasShip && cell.status === 'empty') bg = "bg-gray-400";
    }

    // Statusy trafień/pudeł
    if (cell.status === 'miss') { bg = "bg-blue-200"; content = <span className="text-blue-500 font-bold">•</span>; }
    if (cell.status === 'hit') { bg = "bg-orange-400"; content = <span className="text-white font-bold">X</span>; }
    if (cell.status === 'sunk') { bg = "bg-red-700 border-red-800"; content = <span className="text-black font-extrabold">☠</span>; }
    
    const clickHandler = () => {
        if (gameState === 'setup' && !isEnemy) handleSetupCellClick(index);
        if (gameState === 'playing' && isEnemy) handlePlayerMove(index);
    };

    return (
      <div key={index} 
        onClick={clickHandler}
        onMouseEnter={() => !isEnemy && gameState === 'setup' && handleSetupHover(index)}
        onMouseLeave={() => !isEnemy && gameState === 'setup' && setHoveredCells([])}
        className={`w-full aspect-square border border-blue-200 flex items-center justify-center text-sm transition-colors duration-200 ${bg} ${cursor}`}>
        {content}
      </div>
    );
  };

  if (loading) return <div className="text-center p-10">Ładowanie...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-black text-center text-indigo-900 uppercase tracking-widest drop-shadow-sm">
        Strefa Bojowa
      </h1>
      
      {/* --- PANEL GRY (ZARÓWNO SETUP JAK I PLAYING) --- */}
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
          
          {/* --- GRACZ / SETUP --- */}
          <div className="flex-1 w-full max-w-md">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-gray-700 text-lg tracking-wide">TY</h2>
                {gameState === 'setup' && (
                     <span className="text-sm font-bold text-indigo-600">
                        {shipsToPlace.length > 0 ? "Ustawianie..." : "Gotowe!"}
                     </span>
                )}
            </div>
            
            <div className={`grid grid-cols-10 gap-px border-4 border-gray-300 bg-gray-300 shadow-2xl rounded-lg overflow-hidden ${turn === 'enemy' && gameState === 'playing' ? 'opacity-80 grayscale-[0.3]' : ''}`}>
              {playerBoard.map((c, i) => renderCell(c, i, false))}
            </div>

            {/* Kontrolki setupu pod planszą gracza */}
            {gameState === 'setup' && (
                <div className="mt-4 p-4 bg-white rounded-xl shadow-md border border-indigo-100">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setIsHorizontal(!isHorizontal)} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-indigo-600">
                            <span className="text-xl">↻</span> {isHorizontal ? "Poziomo" : "Pionowo"}
                        </button>
                        <div className="space-x-2">
                             <button onClick={randomizePlayerBoard} className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Losuj</button>
                             <button onClick={resetSetup} className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded">Reset</button>
                        </div>
                    </div>
                    
                    {shipsToPlace.length > 0 ? (
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Do rozmieszczenia:</p>
                            <div className="flex flex-wrap gap-2">
                                {shipsToPlace.map((ship, idx) => (
                                    <div key={idx} className={`h-6 bg-gray-600 rounded ${idx === 0 ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'opacity-50'}`} style={{width: `${ship.size * 12}px`}}></div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-green-600 font-bold py-2">
                            Wszystkie statki ustawione!
                        </div>
                    )}
                </div>
            )}
          </div>
          
          {/* --- PANEL KONTROLNY (ŚRODEK) --- */}
          <div className="w-full lg:w-72 bg-gray-800 p-4 rounded-2xl shadow-2xl border-2 border-gray-700 flex flex-col mt-1">
            
            {/* Nagłówek statusu */}
            <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-3">
                <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Status</span>
                    <span className={`font-black text-lg ${gameState === 'playing' ? (turn === 'player' ? 'text-green-400 animate-pulse' : 'text-red-400') : 'text-white'}`}>
                        {gameState === 'setup' ? 'PRZYGOTOWANIE' : (gameState === 'playing' ? (turn === 'player' ? 'TWOJA TURA' : 'RUCH WROGA') : (gameState === 'won' ? 'ZWYCIĘSTWO!' : 'PORAŻKA'))}
                    </span>
                </div>
                
                {gameState === 'playing' && (
                    <div className="flex flex-col items-end">
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Do zatopienia</span>
                        <span className="text-red-400 font-mono text-lg font-bold">
                            {countEnemyShipsLeft()} <span className="text-xs text-gray-500">/ {SHIPS_CONFIG.length}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Logi gry */}
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs text-gray-300 pr-2 custom-scrollbar h-64">
                {logs.map((l, i) => (
                    <div key={i} className={`p-2 rounded border-l-4 ${i===0 ? 'bg-gray-700 border-green-500 text-white shadow-md' : 'border-gray-600 text-gray-400'}`}>
                        <p className="break-words leading-relaxed">{l}</p>
                    </div>
                ))}
            </div>

            {/* Przyciski Akcji */}
            <div className="mt-4">
                {gameState === 'setup' && (
                    <button 
                        onClick={startGame} 
                        disabled={shipsToPlace.length > 0}
                        className={`w-full py-3 rounded-lg font-bold shadow-lg uppercase tracking-wide text-sm transition-all
                            ${shipsToPlace.length === 0 ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                        {shipsToPlace.length === 0 ? 'ROZPOCZNIJ BITWĘ' : 'Ustaw statki'}
                    </button>
                )}

                {(gameState === 'won' || gameState === 'lost') && (
                    <button onClick={() => { setGameState('setup'); resetSetup(); }} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-500 transition shadow-lg uppercase tracking-wide text-sm">
                        Zagraj Ponownie
                    </button>
                )}
            </div>
          </div>

          {/* --- PRZECIWNIK --- */}
          <div className="flex-1 w-full max-w-md">
            <h2 className="text-center font-bold mb-3 text-red-600 text-lg tracking-wide">WRÓG</h2>
            {gameState === 'setup' ? (
                 <div className="aspect-square bg-gray-200 border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Oczekiwanie...</p>
                 </div>
            ) : (
                <div className={`grid grid-cols-10 gap-px border-4 border-red-300 bg-red-300 shadow-2xl rounded-lg overflow-hidden relative transition-all duration-300 ${turn !== 'player' ? 'opacity-90 cursor-not-allowed' : 'hover:scale-[1.01]'}`}>
                {enemyBoard.map((c, i) => renderCell(c, i, true))}
                
                {/* Overlay podczas tury wroga */}
                {turn !== 'player' && gameState === 'playing' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                        <div className="bg-black/80 text-white px-4 py-2 rounded-full shadow-2xl text-xs font-bold animate-pulse tracking-widest border border-red-500/50">
                            ANALIZA RUCHU...
                        </div>
                    </div>
                )}
                </div>
            )}
          </div>

        </div>
    </div>
  );
}
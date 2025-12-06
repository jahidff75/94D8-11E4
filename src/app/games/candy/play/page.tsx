'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const candyTypes = [
    { type: '●', color: 'text-red-500' },
    { type: '◆', color: 'text-blue-500' },
    { type: '▲', color: 'text-green-500' },
    { type: '■', color: 'text-yellow-500' },
    { type: '♥', color: 'text-purple-500' },
    { type: '★', color: 'text-orange-500' }
];

const getRandomCandy = () => candyTypes[Math.floor(Math.random() * candyTypes.length)];

const Candy = ({ candy, isSelected }: { candy: {type: string, color: string}, isSelected: boolean }) => {
    return <div className={cn("w-10 h-10 flex items-center justify-center text-4xl font-bold drop-shadow-lg transition-all duration-200", candy.color, isSelected && "scale-125 ring-2 ring-white rounded-full")}>{candy.type}</div>
}

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [grid, setGrid] = useState<(typeof candyTypes[0] | null)[]>([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(20);
    const [target, setTarget] = useState(25000);
    const [gameOver, setGameOver] = useState(false);
    const [selectedCandy, setSelectedCandy] = useState<number | null>(null);

    const gridSize = 7;

    const createBoard = () => Array.from({ length: gridSize * gridSize }).map(() => getRandomCandy());

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
            setGrid(createBoard());
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const checkForMatches = (currentGrid: (typeof candyTypes[0] | null)[]) => {
        let newGrid = [...currentGrid];
        let matchFound = false;

        // Check rows
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize - 2; c++) {
                const rowStart = r * gridSize;
                const candy1 = newGrid[rowStart + c];
                const candy2 = newGrid[rowStart + c + 1];
                const candy3 = newGrid[rowStart + c + 2];
                if (candy1 && candy1 === candy2 && candy2 === candy3) {
                    newGrid[rowStart + c] = null;
                    newGrid[rowStart + c + 1] = null;
                    newGrid[rowStart + c + 2] = null;
                    setScore(s => s + 300);
                    matchFound = true;
                }
            }
        }
        // Check columns
        for (let c = 0; c < gridSize; c++) {
            for (let r = 0; r < gridSize - 2; r++) {
                const colStart = r * gridSize;
                const candy1 = newGrid[colStart + c];
                const candy2 = newGrid[colStart + gridSize + c];
                const candy3 = newGrid[colStart + 2 * gridSize + c];
                if (candy1 && candy1 === candy2 && candy2 === candy3) {
                    newGrid[colStart + c] = null;
                    newGrid[colStart + gridSize + c] = null;
                    newGrid[colStart + 2 * gridSize + c] = null;
                    setScore(s => s + 300);
                    matchFound = true;
                }
            }
        }

        if (matchFound) {
            // Gravity
            for (let c = 0; c < gridSize; c++) {
                let emptyRow = gridSize - 1;
                for (let r = gridSize - 1; r >= 0; r--) {
                    if (newGrid[r * gridSize + c]) {
                        [newGrid[r * gridSize + c], newGrid[emptyRow * gridSize + c]] = [newGrid[emptyRow * gridSize + c], newGrid[r * gridSize + c]];
                        emptyRow--;
                    }
                }
            }
            // Fill empty spaces
            newGrid = newGrid.map(cell => cell === null ? getRandomCandy() : cell);
            setGrid(newGrid);
            setTimeout(() => checkForMatches(newGrid), 300);
        }
        return matchFound;
    };
    
    useEffect(() => {
        if(isGameStarted && grid.length > 0) {
            const hasInitialMatches = checkForMatches(grid);
            if(hasInitialMatches) {
              // Board will reshuffle
            }
        }
    }, [isGameStarted]);

    useEffect(() => {
        if (moves <= 0 && score < target) {
            setGameOver(true);
        } else if (score >= target) {
            setGameOver(true); // Win condition
        }
    }, [moves, score, target]);


    const handleCandyClick = (index: number) => {
        if (gameOver) return;
        if (selectedCandy === null) {
            setSelectedCandy(index);
        } else {
            const isAdjacent = Math.abs(selectedCandy - index) === 1 || Math.abs(selectedCandy - index) === gridSize;
            if (isAdjacent) {
                const newGrid = [...grid];
                [newGrid[selectedCandy], newGrid[index]] = [newGrid[index], newGrid[selectedCandy]];
                setGrid(newGrid);
                setMoves(m => m - 1);
                setTimeout(() => checkForMatches(newGrid), 300);
            }
            setSelectedCandy(null);
        }
    };

  return (
    <div className="flex flex-col h-screen bg-pink-200 text-gray-800">
      <header className="flex items-center justify-between p-2 border-b-2 border-pink-300 bg-pink-100">
        <Link href="/games/candy" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-pink-600">Candy Crush</h1>
        <div className="w-10"></div>
      </header>

      {!isGameStarted ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse text-pink-600">Game is starting...</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin text-pink-500" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-between p-4 bg-pink-50">
             <div className="w-full flex justify-between items-center bg-white/70 p-2 rounded-lg shadow-md">
                <div>
                    <p className="text-sm text-gray-500">SCORE</p>
                    <p className="text-2xl font-bold text-pink-500">{score}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500">MOVES</p>
                    <p className="text-2xl font-bold text-center">{moves}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">TARGET</p>
                    <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1"><Star className="fill-yellow-400"/> {target}</p>
                </div>
             </div>

             <div className="w-full max-w-sm aspect-square bg-pink-100/50 border-4 border-pink-200 rounded-lg p-2 grid grid-cols-7 grid-rows-7 gap-1 my-4">
                {grid.map((candy, i) => (
                    candy ? (
                    <div 
                        key={i} 
                        className="flex items-center justify-center bg-pink-200/50 rounded-md cursor-pointer"
                        onClick={() => handleCandyClick(i)}
                    >
                        <Candy candy={candy} isSelected={selectedCandy === i} />
                    </div>
                    ) : <div key={i}></div>
                ))}
             </div>
             
             {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    {score >= target ? <Star className="w-24 h-24 text-yellow-400 fill-yellow-400"/> : <XCircle className="w-24 h-24 text-red-500" />}
                    <h2 className="text-4xl font-bold text-white mt-4">{score >= target ? 'You Win!' : 'Game Over'}</h2>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/candy" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

             <div className="w-full max-w-md p-2 text-center">
                <p className="font-bold text-lg text-pink-700">Combine 3 candies to crush them!</p>
            </div>
        </main>
      )}

    </div>
  );
}

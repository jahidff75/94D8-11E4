'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCw, Star, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';


const Block = ({ color }: { color?: string }) => (
    <div className={cn("w-full h-full border", color ? color : 'bg-gray-700/50 border-gray-900/20')}></div>
);

const BlockShape = ({ shape, color, onDragStart }: { shape: number[][], color: string, onDragStart: (e: React.DragEvent<HTMLDivElement>) => void }) => (
    <div draggable onDragStart={onDragStart} className="grid grid-cols-3 grid-rows-3 w-20 h-20 cursor-pointer">
        {shape.flat().map((cell, i) => (
            cell ? <div key={i} className={cn("w-full h-full", color)}></div> : <div key={i}></div>
        ))}
    </div>
)

const shapes = [
    { id: 't', shape: [[0,1,0],[1,1,1],[0,0,0]], color: 'bg-purple-500 border-purple-700' },
    { id: 'o', shape: [[1,1,0],[1,1,0],[0,0,0]], color: 'bg-yellow-400 border-yellow-600' },
    { id: 'l', shape: [[1,0,0],[1,0,0],[1,1,0]], color: 'bg-orange-500 border-orange-700' },
    { id: 'i', shape: [[0,1,0],[0,1,0],[0,1,0]], color: 'bg-cyan-500 border-cyan-700' },
    { id: 's', shape: [[0,1,1],[1,1,0],[0,0,0]], color: 'bg-green-500 border-green-700' },
    { id: 'z', shape: [[1,1,0],[0,1,1],[0,0,0]], color: 'bg-red-500 border-red-700' },
];

const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [gameOver, setGameOver] = useState(false);
    
    const initialGrid = Array.from({length: 64}).map(() => ({ color: undefined }));
    const [grid, setGrid] = useState<{color: string | undefined}[]>(initialGrid);

    const [currentShapes, setCurrentShapes] = useState([getRandomShape(), getRandomShape(), getRandomShape()]);

    useEffect(() => {
        const timer = setTimeout(() => setIsGameStarted(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isGameStarted || gameOver) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameOver(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);
        return () => clearInterval(timer);
    }, [isGameStarted, gameOver]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, shapeId: string, shapeIndex: number) => {
        e.dataTransfer.setData("shapeId", shapeId);
        e.dataTransfer.setData("shapeIndex", shapeIndex.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        const shapeId = e.dataTransfer.getData("shapeId");
        const shapeIndex = parseInt(e.dataTransfer.getData("shapeIndex"), 10);
        const shapeData = shapes.find(s => s.id === shapeId);
        if (!shapeData) return;
        
        // This is a simplified placement logic
        let canPlace = true;
        const newGrid = [...grid];
        const shapeCells: number[] = [];

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (shapeData.shape[r][c]) {
                    const gridIndex = index + (r * 8) + c;
                    if (gridIndex >= 64 || newGrid[gridIndex].color) {
                        canPlace = false;
                        break;
                    }
                    shapeCells.push(gridIndex);
                }
            }
            if (!canPlace) break;
        }

        if (canPlace) {
            shapeCells.forEach(i => {
                newGrid[i] = { color: shapeData.color };
            });
            setScore(s => s + shapeCells.length * 10);
            
            // Simplified line clear logic
            // TODO: Implement actual line clearing for rows and columns
            
            setGrid(newGrid);
            setCurrentShapes(prev => {
                const newShapes = [...prev];
                newShapes[shapeIndex] = getRandomShape(); // Replace used shape
                return newShapes;
            });
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/block_puzzle" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Block Puzzle</h1>
        <div className="w-10"></div>
      </header>

      {!isGameStarted ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse">Game is starting...</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-between p-4">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-lg">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">TIME</p>
                    <p className="text-2xl font-bold">{timeLeft}</p>
                </div>
             </div>

             <div 
                className="w-full max-w-sm aspect-square bg-gray-800 border-4 border-gray-700 rounded-lg p-1 grid grid-cols-8 grid-rows-8 gap-px my-4"
                onDragOver={handleDragOver}
             >
                {grid.map((cell, i) => (
                    <div key={i} onDrop={(e) => handleDrop(e, i)} className="w-full h-full">
                       <Block color={cell.color} />
                    </div>
                ))}
             </div>
             
             {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/block_puzzle" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

             <div className="w-full max-w-md p-4 bg-black/30 rounded-lg flex items-center justify-around">
                {currentShapes.map((s, i) => <BlockShape key={i} shape={s.shape} color={s.color} onDragStart={(e) => handleDragStart(e, s.id, i)}/>)}
            </div>
        </main>
      )}

    </div>
  );
}

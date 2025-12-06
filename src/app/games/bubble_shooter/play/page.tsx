'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const bubbleColors = [
    'bg-red-500 border-red-700', 'bg-blue-500 border-blue-700', 'bg-green-500 border-green-700',
    'bg-yellow-500 border-yellow-700', 'bg-purple-500 border-purple-700', 'bg-pink-500 border-pink-700',
];
const numCols = 9;
const numRows = 12;
const bubbleSize = 36;

type BubbleType = {
    color: string;
    row: number;
    col: number;
} | null;

const Bubble = ({ color }: { color: string | undefined }) => (
    <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center", color)}>
        <div className="w-4 h-4 rounded-full bg-white/40"></div>
    </div>
)

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90);
    const [gameOver, setGameOver] = useState(false);
    const [grid, setGrid] = useState<BubbleType[]>([]);
    const [currentBubble, setCurrentBubble] = useState(bubbleColors[0]);
    const [nextBubble, setNextBubble] = useState(bubbleColors[1]);

    useEffect(() => {
        setTimeout(() => {
            setIsGameStarted(true);
            // Initialize grid
            const initialGrid: BubbleType[] = [];
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < numCols; c++) {
                    if (Math.random() > 0.3) {
                       initialGrid.push({ color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)], row: r, col: c });
                    }
                }
            }
            // A bit messy, just for visualization
            const flatGrid = new Array(numCols * numRows).fill(null);
            initialGrid.forEach(b => {
                if(b) flatGrid[b.row * numCols + b.col] = b;
            });
            setGrid(flatGrid);

        }, 1500);
    }, []);
    
    useEffect(() => {
      if(!isGameStarted || gameOver) return;
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

    const handleShoot = () => {
        if(gameOver) return;
        // Simple logic: pop a random bubble and add score
        setScore(s => s + 100);
        
        let removed = false;
        const newGrid = [...grid];
        for(let i = newGrid.length - 1; i >= 0; i--) {
            if(newGrid[i]?.color === currentBubble) {
                newGrid[i] = null;
                removed = true;
                break;
            }
        }
        if (!removed && newGrid.some(b => b !== null)) {
           for(let i = 0; i < newGrid.length; i++) {
             if(newGrid[i] !== null) {
                newGrid[i] = null;
                break;
             }
           }
        }
        setGrid(newGrid);

        setCurrentBubble(nextBubble);
        setNextBubble(bubbleColors[Math.floor(Math.random() * bubbleColors.length)])
    }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/bubble_shooter" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Bubble Shooter</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between p-4 bg-cover bg-center" style={{backgroundImage: "url('https://i.pinimg.com/736x/8b/4a/5b/8b4a5b1e42b0378b88f34f0c40a5a3a7.jpg')"}}>
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

             <div className="w-full max-w-sm flex-1 my-4 grid gap-1 p-2" style={{gridTemplateColumns: `repeat(${numCols}, 1fr)`}}>
                {grid.map((bubble, i) => (
                    bubble ? <Bubble key={i} color={bubble.color} /> : <div key={i} className="w-8 h-8"></div>
                ))}
             </div>
             
             {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/bubble_shooter" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

             <div className="w-full max-w-md p-4 flex flex-col items-center justify-center gap-4">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-gray-400 cursor-pointer" onClick={handleShoot}></div>
                <div className="flex gap-4 items-center">
                    <Bubble color={currentBubble} />
                    <div className="text-sm">Next:</div>
                     <div className="scale-75"><Bubble color={nextBubble} /></div>
                </div>
            </div>
        </main>
      )}

    </div>
  );
}

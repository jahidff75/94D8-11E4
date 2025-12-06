'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer, Bomb, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const Fruit = ({ type, isSliced }: { type: string, isSliced: boolean }) => {
    return <div className={`text-6xl transition-all duration-150 ${isSliced ? 'rotate-45 opacity-50' : ''}`}>{type}</div>
}

type FruitObject = {
    id: number;
    type: string;
    isSliced: boolean;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    const [fruits, setFruits] = useState<FruitObject[]>([]);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const fruitIdCounter = useRef(0);

    const fruitTypes = ['🍎', '🍌', '🍉', '🍓', '🥝', '🍍', '🍑', '💣'];

    useEffect(() => {
        const startTimer = setTimeout(() => setIsGameStarted(true), 1500);
        return () => clearTimeout(startTimer);
    }, []);

    useEffect(() => {
        if (!isGameStarted || gameOver) return;

        const gameInterval = setInterval(() => {
            // Update fruit positions
            setFruits(prevFruits => 
                prevFruits.map(f => ({
                    ...f,
                    x: f.x + f.vx,
                    y: f.y + f.vy,
                    vy: f.vy + 0.1 // Gravity
                })).filter(f => f.y < 500) // Remove fruits that fall off screen
            );
        }, 16); // ~60 FPS

        const fruitSpawnInterval = setInterval(() => {
            const newFruit: FruitObject = {
                id: fruitIdCounter.current++,
                type: fruitTypes[Math.floor(Math.random() * fruitTypes.length)],
                isSliced: false,
                x: Math.random() * 300,
                y: 450,
                vx: Math.random() * 4 - 2,
                vy: -10 - Math.random() * 5,
            };
            setFruits(prev => [...prev, newFruit]);
        }, 1000);

        const timerInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameOver(true);
                    clearInterval(timerInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(gameInterval);
            clearInterval(fruitSpawnInterval);
            clearInterval(timerInterval);
        };
    }, [isGameStarted, gameOver]);

    const handleSlice = (id: number) => {
        if (gameOver) return;
        setFruits(prevFruits => prevFruits.map(f => {
            if (f.id === id && !f.isSliced) {
                if (f.type === '💣') {
                    setGameOver(true);
                    return { ...f, isSliced: true };
                }
                setScore(s => s + 10);
                return { ...f, isSliced: true };
            }
            return f;
        }));
    }

  return (
    <div className="flex flex-col h-screen bg-yellow-100 text-gray-800">
      <header className="flex items-center justify-between p-2 border-b-2 border-yellow-200 bg-yellow-50">
        <Link href="/games/fruit" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-orange-600">Fruit Samurai</h1>
        <div className="w-10"></div>
      </header>

      {!isGameStarted ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse text-orange-600">Game is starting...</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin text-orange-500" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-between p-4 bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-photo/bamboo-background_53876-97841.jpg')"}}>
             <div className="w-full flex justify-between items-center bg-black/30 text-white p-2 rounded-lg">
                <div>
                    <p className="text-sm">SCORE</p>
                    <p className="text-2xl font-bold">{score}</p>
                </div>
                <div>
                    <p className="text-sm">TIME</p>
                    <p className="text-2xl font-bold">{timeLeft}</p>
                </div>
                 <div>
                    <p className="text-sm">BEST</p>
                    <p className="text-2xl font-bold">3,100</p>
                </div>
             </div>

             <div ref={gameAreaRef} className="w-full flex-1 my-4 relative overflow-hidden">
                 {fruits.map(fruit => (
                    <div 
                        key={fruit.id} 
                        className="absolute cursor-pointer"
                        style={{ top: fruit.y, left: fruit.x }}
                        onMouseEnter={() => handleSlice(fruit.id)}
                        onClick={() => handleSlice(fruit.id)}
                    >
                        <Fruit type={fruit.type} isSliced={fruit.isSliced} />
                    </div>
                 ))}
             </div>

             {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/fruit" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

             <div className="w-full max-w-md p-2 text-center">
                <p className="font-bold text-lg text-white">Slice the fruits, avoid the bombs!</p>
            </div>
        </main>
      )}
    </div>
  );
}

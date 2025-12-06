'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Fish, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type FishObject = {
  id: number;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  points: number;
};

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    const [fishes, setFishes] = useState<FishObject[]>([]);
    const fishIdCounter = useRef(0);

    const fishTypes = [
        { type: '🐟', points: 10 }, 
        { type: '🐠', points: 20 }, 
        { type: '🐡', points: 50 },
        { type: '🦐', points: 30 },
        { type: '🦀', points: -50 }, // Bad catch!
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsGameStarted(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isGameStarted || gameOver) return;

        const gameLoop = setInterval(() => {
            setFishes(prevFishes =>
                prevFishes.map(fish => {
                    let newX = fish.x + fish.vx;
                    if (newX < -10 || newX > 110) {
                        fish.vx *= -1; // Bounce off sides
                    }
                    return { ...fish, x: newX };
                }).filter(fish => fish.x < 120 && fish.x > -20)
            );
        }, 50);

        const fishSpawner = setInterval(() => {
            const fishInfo = fishTypes[Math.floor(Math.random() * fishTypes.length)];
            const direction = Math.random() > 0.5 ? 1 : -1;
            const newFish: FishObject = {
                id: fishIdCounter.current++,
                type: fishInfo.type,
                points: fishInfo.points,
                y: Math.random() * 80 + 10,
                x: direction > 0 ? -10 : 110,
                vx: direction * (Math.random() * 1 + 1),
                vy: 0,
            };
            setFishes(prev => [...prev, newFish]);
        }, 1200);
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameOver(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(gameLoop);
            clearInterval(fishSpawner);
            clearInterval(timer);
        };
    }, [isGameStarted, gameOver]);

    const handleCatchFish = (id: number, points: number) => {
        setScore(s => s + points);
        setFishes(fishes => fishes.filter(f => f.id !== id));
    };

  return (
    <div className="flex flex-col h-screen bg-blue-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-blue-700 bg-blue-800/50 z-10">
        <Link href="/games/fish" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Fish Frenzy</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between bg-cover bg-center overflow-hidden" style={{backgroundImage: "url('https://img.freepik.com/free-vector/underwater-background-with-sun-rays_1017-38668.jpg')"}}>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">TIME</p>
                    <p className="text-2xl font-bold">{timeLeft}</p>
                </div>
             </div>

             <div className="w-full h-full relative">
                {fishes.map((fish) => (
                    <div 
                        key={fish.id} 
                        className="absolute text-4xl cursor-pointer"
                        style={{
                            top: `${fish.y}%`,
                            left: `${fish.x}%`,
                            transform: `scaleX(${fish.vx > 0 ? 1 : -1})`,
                            transition: 'left 0.05s linear'
                        }}
                        onClick={() => handleCatchFish(fish.id, fish.points)}
                    >
                        {fish.type}
                    </div>
                ))}
             </div>

             {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/fish" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

             <div className="w-full p-4 text-center bg-black/30 rounded-t-lg z-10">
                <p className="font-bold text-lg">Tap the fish to catch them!</p>
            </div>
        </main>
      )}

    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type Zombie = {
    id: number;
    x: number;
    isSmashed: boolean;
}

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [ammo, setAmmo] = useState(30);
    const [zombies, setZombies] = useState<Zombie[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const zombieIdCounter = useRef(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsGameStarted(true), 1500);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
      if (!isGameStarted || gameOver) return;
      
      const spawner = setInterval(() => {
        const newZombie: Zombie = {
          id: zombieIdCounter.current++,
          x: Math.random() * 80 + 10,
          isSmashed: false,
        };
        setZombies(prev => [...prev, newZombie].slice(-10)); // Keep max 10 zombies
      }, 2000);
      
      return () => clearInterval(spawner);
      
    }, [isGameStarted, gameOver]);
    
    useEffect(() => {
      if(ammo <= 0) {
        setGameOver(true);
      }
    }, [ammo]);

    const handleSmash = (id: number) => {
        if(gameOver || ammo <= 0) return;
        setAmmo(a => a - 1);
        setZombies(zombies => zombies.map(z => {
            if (z.id === id && !z.isSmashed) {
                setScore(s => s + 100);
                return { ...z, isSmashed: true };
            }
            return z;
        }));
        // Remove smashed zombie after a delay
        setTimeout(() => {
          setZombies(zombies => zombies.filter(z => z.id !== id));
        }, 500);
    };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800/50 z-10">
        <Link href="/games/zombie" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Zombie Smash</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between relative bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-vector/dark-graveyard-scene-with-old-tombstones_1308-89218.jpg?w=1380')"}}>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">AMMO</p>
                    <p className="text-2xl font-bold">{ammo}</p>
                </div>
             </div>

            {/* Zombies */}
            {zombies.map(zombie => (
                <div 
                    key={zombie.id} 
                    className="absolute bottom-10 text-8xl z-10 animate-zombie-walk cursor-pointer"
                    style={{ left: `${zombie.x}%`, animationDelay: `${Math.random()}s`}}
                    onClick={() => handleSmash(zombie.id)}
                >
                    {zombie.isSmashed ? '💥' : '🧟'}
                </div>
            ))}
            
             {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                     <p className="text-lg text-white">Out of ammo!</p>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/zombie" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Tap the zombies to smash them!</p>
            </div>

             <style jsx>{`
                @keyframes zombie-walk {
                    0% { transform: translateY(100%); opacity: 0; }
                    20% { transform: translateY(0); opacity: 1; }
                    80% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
                .animate-zombie-walk {
                    animation: zombie-walk 5s ease-out infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

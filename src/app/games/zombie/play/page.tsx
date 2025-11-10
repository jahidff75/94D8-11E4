'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Game is starting...');
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

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
                    <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-between relative bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-vector/dark-graveyard-scene-with-old-tombstones_1308-89218.jpg?w=1380')"}}>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">3,150</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">AMMO</p>
                    <p className="text-2xl font-bold">25</p>
                </div>
             </div>

            {/* Zombies */}
             <div className="absolute bottom-10 left-1/4 text-8xl z-10 animate-zombie-walk">🧟</div>
             <div className="absolute bottom-10 left-1/2 text-8xl z-10 animate-zombie-walk" style={{animationDelay: '1s'}}>🧟‍♀️</div>
             <div className="absolute bottom-10 left-3/4 text-8xl z-10 animate-zombie-walk" style={{animationDelay: '0.5s'}}>🧟</div>

             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Tap the zombies to smash them!</p>
            </div>

             <style jsx>{`
                @keyframes zombie-walk {
                    0% { transform: translateY(100%); opacity: 0; }
                    50% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-zombie-walk {
                    animation: zombie-walk 3s ease-out infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

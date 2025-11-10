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
    <div className="flex flex-col h-screen bg-green-900 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-green-700 bg-green-800/50 z-10">
        <Link href="/games/jungle_run" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Jungle Run</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between relative">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">1,250 m</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">COINS</p>
                    <p className="text-2xl font-bold">34</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full bg-cover animate-bg-pan" style={{backgroundImage: "url('https://img.freepik.com/free-vector/jungle-game-background_1047-307.jpg?w=1380')"}}></div>
            
            {/* Player Character */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-run">
                <div className="w-16 h-24 bg-blue-500 rounded-t-full relative">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-200 rounded-full"></div>
                </div>
            </div>

            {/* Obstacle */}
             <div className="absolute bottom-12 right-0 w-12 h-12 bg-red-800 z-10 animate-obstacle"></div>

             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Tap to Jump!</p>
            </div>

             <style jsx>{`
                @keyframes bg-pan {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
                .animate-bg-pan {
                    animation: bg-pan 10s linear infinite;
                }
                @keyframes run {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-run {
                    animation: run 0.5s linear infinite;
                }
                 @keyframes obstacle {
                    0% { transform: translateX(100vw); }
                    100% { transform: translateX(-100vw); }
                }
                .animate-obstacle {
                    animation: obstacle 5s linear infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

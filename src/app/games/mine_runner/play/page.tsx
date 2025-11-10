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
    <div className="flex flex-col h-screen bg-gray-800 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900/50 z-10">
        <Link href="/games/mine_runner" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Mine Runner</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between relative bg-yellow-900/50">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">DISTANCE</p>
                    <p className="text-2xl font-bold text-yellow-400">850 m</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">GEMS</p>
                    <p className="text-2xl font-bold text-cyan-400">45</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full bg-repeat-x animate-bg-pan" style={{backgroundImage: "url('https://img.freepik.com/free-vector/cave-background-scene_1308-95333.jpg?w=1380')", backgroundSize: 'auto 100%'}}></div>
            
            {/* Character in a minecart */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 animate-cart-bob">
                 <div className="w-20 h-16 bg-yellow-700 border-4 border-yellow-900 rounded-t-lg relative flex justify-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full absolute -top-5"></div>
                    <div className="absolute -bottom-3 left-1 w-6 h-6 bg-gray-600 rounded-full border-2 border-black"></div>
                    <div className="absolute -bottom-3 right-1 w-6 h-6 bg-gray-600 rounded-full border-2 border-black"></div>
                 </div>
            </div>

            {/* Gem */}
             <div className="absolute top-1/2 right-0 text-4xl z-10 animate-obstacle">💎</div>

             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Tap to Jump!</p>
            </div>

             <style jsx>{`
                @keyframes bg-pan {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .animate-bg-pan {
                    animation: bg-pan 10s linear infinite;
                }
                @keyframes cart-bob {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-2px) rotate(1deg); }
                    75% { transform: translateY(-2px) rotate(-1deg); }
                }
                .animate-cart-bob {
                    animation: cart-bob 0.8s ease-in-out infinite;
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

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
        <Link href="/games/space_hunter" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Space Hunter</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between relative bg-black">
             <div className="absolute inset-0 w-full h-full bg-repeat animate-bg-pan opacity-30" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"}}></div>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">12,300</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">LIVES</p>
                    <p className="text-2xl font-bold text-red-500">🚀🚀🚀</p>
                </div>
             </div>

            
            {/* Player ship */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-6xl animate-bob">
                🛸
            </div>

            {/* Asteroids */}
             <div className="absolute -top-10 left-1/4 text-5xl z-10 animate-fly-down">☄️</div>
             <div className="absolute -top-20 left-3/4 text-5xl z-10 animate-fly-down" style={{animationDelay: '1.2s'}}>☄️</div>
             <div className="absolute -top-16 left-1/2 text-4xl z-10 animate-fly-down" style={{animationDelay: '2.5s'}}>☄️</div>


             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Swipe to Move!</p>
            </div>

             <style jsx>{`
                @keyframes bg-pan {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 0% 200%; }
                }
                .animate-bg-pan {
                    animation: bg-pan 20s linear infinite;
                }
                @keyframes bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bob {
                    animation: bob 1.5s ease-in-out infinite;
                }
                 @keyframes fly-down {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(100vh) rotate(360deg); }
                }
                .animate-fly-down {
                    animation: fly-down 4s linear infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

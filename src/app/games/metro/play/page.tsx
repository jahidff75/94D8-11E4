'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer } from 'lucide-react';
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
        <Link href="/games/metro" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Metro Surface</h1>
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
                    <p className="text-2xl font-bold text-yellow-400">3,450</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">COINS</p>
                    <p className="text-2xl font-bold">88</p>
                </div>
             </div>
            
            {/* Background Animation */}
            <div className="absolute inset-0 w-full h-full flex flex-col animate-track-move">
                <div className="w-full h-1/2 bg-cyan-300"></div>
                <div className="w-full h-1/2 bg-gray-600 relative">
                     <div className="absolute w-full h-4 bg-gray-400 top-4"></div>
                     <div className="absolute w-full h-4 bg-gray-400 top-12"></div>
                </div>
            </div>

            {/* Character */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-16 h-24 bg-red-500 z-10 animate-character-run rounded-t-lg"></div>

            {/* Train */}
            <div className="absolute bottom-24 -right-full w-32 h-40 bg-yellow-500 z-10 animate-train-pass rounded-t-lg border-4 border-black"></div>

             <div className="absolute bottom-0 w-full p-4 text-center z-10 bg-black/50">
                <p className="font-bold text-lg">Swipe Left/Right to Move!</p>
            </div>

             <style jsx>{`
                @keyframes track-move {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50%); }
                }
                .animate-track-move {
                    animation: track-move 2s linear infinite;
                }
                 @keyframes character-run {
                    0%, 100% { transform: translateY(0) scaleY(1); }
                    50% { transform: translateY(-5px) scaleY(1.05); }
                }
                .animate-character-run {
                    animation: character-run 0.5s ease-in-out infinite;
                }
                 @keyframes train-pass {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-200vw); }
                }
                .animate-train-pass {
                    animation: train-pass 4s linear infinite;
                    animation-delay: 2s;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

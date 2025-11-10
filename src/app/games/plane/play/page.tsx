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
    <div className="flex flex-col h-screen bg-cyan-700 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-cyan-600 bg-cyan-800/50 z-10">
        <Link href="/games/plane" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Plane Mayhem</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between relative bg-cyan-400">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">9,800</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">LIVES</p>
                    <p className="text-2xl font-bold text-red-500">❤️❤️💔</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full bg-repeat-y animate-bg-pan" style={{backgroundImage: "url('https://img.freepik.com/free-vector/sky-background-video-conferencing_23-2148639332.jpg')", backgroundSize: '100% auto'}}></div>
            
            {/* Player Plane */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-6xl animate-bob">
                ✈️
            </div>

            {/* Enemy */}
             <div className="absolute -top-10 left-1/4 text-5xl z-10 animate-fly-down">🚀</div>
             <div className="absolute -top-20 left-3/4 text-5xl z-10 animate-fly-down" style={{animationDelay: '1.5s'}}>🚀</div>


             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Tap to Shoot!</p>
            </div>

             <style jsx>{`
                @keyframes bg-pan {
                    0% { background-position: 50% 0%; }
                    100% { background-position: 50% 200%; }
                }
                .animate-bg-pan {
                    animation: bg-pan 10s linear infinite;
                }
                @keyframes bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bob {
                    animation: bob 1s ease-in-out infinite;
                }
                 @keyframes fly-down {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100vh); }
                }
                .animate-fly-down {
                    animation: fly-down 3s linear infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

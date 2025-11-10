'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Waiting for Racers...');
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900/50 z-10">
        <Link href="/games/racing" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Racing Clash</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between relative bg-gray-600">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SPEED</p>
                    <p className="text-2xl font-bold text-yellow-400">180 KPH</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">LAP</p>
                    <p className="text-2xl font-bold">1 / 3</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">POSITION</p>
                    <p className="text-2xl font-bold">2 / 4</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full perspective-1000">
                <div className="absolute inset-0 w-full h-full bg-sky-400"></div>
                <div className="absolute bottom-0 w-full h-1/2 bg-gray-500 animate-road"></div>
            </div>
            
            {/* Player Car */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-24 h-32 bg-red-600 rounded-t-lg border-4 border-black animate-car-bob">
                <div className="w-full h-8 bg-red-800"></div>
            </div>

            {/* Opponent Car */}
             <div className="absolute bottom-32 left-1/4 -translate-x-1/2 z-10 w-20 h-28 bg-blue-600 rounded-t-lg border-4 border-black"></div>

             <div className="absolute bottom-0 w-full p-4 flex justify-between z-20">
                <Button className="font-bold text-2xl px-8 py-8 rounded-full">BRAKE</Button>
                <Button className="font-bold text-2xl px-8 py-8 rounded-full">NITRO</Button>
            </div>

             <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .animate-road {
                    transform-origin: bottom;
                    animation: road 2s linear infinite;
                    background-image:
                        repeating-linear-gradient(
                            90deg,
                            transparent, transparent 20px,
                            #fff 20px, #fff 40px
                        );
                    background-size: 100px 100%;
                }
                 @keyframes road {
                    from { transform: rotateX(60deg) translateY(0); }
                    to { transform: rotateX(60deg) translateY(100px); }
                }
                 @keyframes car-bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .animate-car-bob {
                    animation: car-bob 0.5s ease-in-out infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

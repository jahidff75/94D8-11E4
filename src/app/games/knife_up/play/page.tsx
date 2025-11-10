'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Game is starting...');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
        }, 1500);

        if(isGameStarted) {
             const rotationInterval = setInterval(() => {
                setRotation(prev => prev + 2);
            }, 16);
            return () => clearInterval(rotationInterval);
        }

        return () => clearTimeout(timer);
    }, [isGameStarted]);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/knife_up" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Knife Up</h1>
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
        <main className="flex-1 flex flex-col items-center justify-around p-4 bg-gray-900">
            <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-lg">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">7</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">STAGE</p>
                    <p className="text-2xl font-bold">2</p>
                </div>
            </div>

            <div className="relative w-48 h-48">
                <div 
                    className="w-full h-full bg-yellow-500 rounded-full flex items-center justify-center font-bold text-4xl text-black"
                    style={{ transform: `rotate(${rotation}deg)`}}
                >
                   🍉
                </div>
                {/* Knives stuck in the target */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-4xl transform rotate-180">🔪</div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full text-4xl">🔪</div>
            </div>


            <div className="flex flex-col items-center gap-4">
                <div className="text-5xl animate-bounce">🔪</div>
                <Button className="font-bold text-2xl px-12 py-8 bg-green-600 hover:bg-green-700">THROW</Button>
            </div>
        </main>
      )}

    </div>
  );
}

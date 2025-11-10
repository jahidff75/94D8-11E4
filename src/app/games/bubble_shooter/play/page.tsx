'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const Bubble = ({ color }: { color: string }) => (
    <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center", color)}>
        <div className="w-4 h-4 rounded-full bg-white/40"></div>
    </div>
)

export default function GamePlayPage() {
    const [status, setStatus] = useState('Game is starting...');
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const bubbleColors = [
        'bg-red-500 border-red-700', 'bg-blue-500 border-blue-700', 'bg-green-500 border-green-700',
        'bg-yellow-500 border-yellow-700', 'bg-purple-500 border-purple-700', 'bg-pink-500 border-pink-700',
    ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/bubble_shooter" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Bubble Shooter</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between p-4 bg-cover bg-center" style={{backgroundImage: "url('https://i.pinimg.com/736x/8b/4a/5b/8b4a5b1e42b0378b88f34f0c40a5a3a7.jpg')"}}>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-lg">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">8,400</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">TIME</p>
                    <p className="text-2xl font-bold">01:15</p>
                </div>
             </div>

             <div className="w-full max-w-sm flex-1 my-4 flex flex-col items-center">
                <div className="w-full grid grid-cols-9 gap-1 p-2">
                    {Array.from({length: 45}).map((_, i) => (
                        <Bubble key={i} color={bubbleColors[Math.floor(Math.random() * bubbleColors.length)]} />
                    ))}
                </div>
             </div>

             <div className="w-full max-w-md p-4 flex flex-col items-center justify-center gap-4">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-gray-400"></div>
                <Bubble color={bubbleColors[1]} />
            </div>
        </main>
      )}

    </div>
  );
}

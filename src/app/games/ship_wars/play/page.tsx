'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponent...');
    const [opponent, setOpponent] = useState<{name: string, avatar: string} | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpponent({ name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival' });
            setStatus('Match Starting!');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

  return (
    <div className="flex flex-col h-screen bg-blue-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-blue-700">
        <Link href="/games/ship_wars" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Ship Wars</h1>
        <div className="w-10"></div>
      </header>

      {!opponent ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                     <div className="flex justify-center items-center space-x-8">
                        <Avatar className="w-24 h-24 border-4 border-blue-500">
                            <AvatarImage src="https://i.pravatar.cc/150?u=you" />
                            <AvatarFallback>YOU</AvatarFallback>
                        </Avatar>
                        <span className="text-4xl font-bold text-primary animate-pulse">VS</span>
                        <div className="w-24 h-24 border-4 border-dashed border-red-500 rounded-full flex items-center justify-center">
                             <Timer className="w-12 h-12 text-red-500 animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-around p-4 bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-vector/ocean-surface-background_1308-72622.jpg')"}}>
             <div className="w-full max-w-md aspect-square bg-blue-500/70 border-4 border-blue-400 rounded-lg p-1 grid grid-cols-8 grid-rows-8 gap-1">
                 {Array.from({length: 64}).map((_, i) => {
                     const isHit = i === 18;
                     const isMiss = i === 20;
                     const isShip = i > 33 && i < 37;
                     return (
                         <div key={i} className={`flex items-center justify-center rounded-sm ${isHit ? 'bg-red-500' : isMiss ? 'bg-white/50' : 'bg-blue-400/50'} ${isShip ? 'bg-gray-600' : ''}`}>
                             {isHit && <span className="text-2xl">🔥</span>}
                             {isMiss && <span className="text-2xl">●</span>}
                         </div>
                     )
                 })}
             </div>
             <p className="mt-4 animate-pulse text-xl font-bold drop-shadow-lg">Select a square to fire!</p>
        </main>
      )}

    </div>
  );
}

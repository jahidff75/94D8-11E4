'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer } from 'lucide-react';
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
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/air_hockey" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Air Hockey</h1>
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
        <main className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md aspect-[9/16] bg-blue-900 rounded-2xl border-8 border-gray-400 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Scores */}
                <div className="flex justify-between p-4">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-10 h-10 border-2 border-red-500"><AvatarImage src={opponent.avatar} /></Avatar>
                        <span className="font-bold text-lg">3</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">2</span>
                         <Avatar className="w-10 h-10 border-2 border-blue-500"><AvatarImage src="https://i.pravatar.cc/150?u=you" /></Avatar>
                    </div>
                </div>

                {/* Game Area */}
                <div className="flex-1 bg-blue-700 m-2 rounded-lg relative border-4 border-white/50">
                    {/* Center Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/30"></div>
                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-white/30 rounded-full"></div>
                    
                    {/* Goals */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-red-800"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-blue-800"></div>

                    {/* Puck */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full border-2 border-white"></div>

                    {/* Paddles */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>

                <div className="p-2 text-center">
                    <p className="font-mono text-2xl">01:23</p>
                </div>
            </div>
        </main>
      )}

    </div>
  );
}

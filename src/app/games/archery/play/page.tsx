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
        <Link href="/games/archery" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Archery King</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between p-4 bg-cover bg-center" style={{backgroundImage: "url('https://img.freepik.com/free-vector/archery-range-with-targets-field_107791-4433.jpg?w=1380')"}}>
             <div className="w-full flex justify-between items-start">
                <div className="flex items-center gap-2 p-2 bg-black/50 rounded-lg">
                     <Avatar className="w-10 h-10 border-2 border-blue-500"><AvatarImage src="https://i.pravatar.cc/150?u=you" /></Avatar>
                     <div>
                         <p className="font-bold">You</p>
                         <p className="text-lg font-bold text-yellow-400">120</p>
                     </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-black/50 rounded-lg">
                     <div>
                         <p className="font-bold">{opponent.name}</p>
                         <p className="text-lg font-bold text-yellow-400">110</p>
                     </div>
                     <Avatar className="w-10 h-10 border-2 border-red-500"><AvatarImage src={opponent.avatar} /></Avatar>
                </div>
             </div>

             <div className="relative">
                 <p className="text-4xl font-bold text-white drop-shadow-lg animate-ping">10</p>
                 <Star className="text-yellow-400 w-24 h-24 fill-yellow-400" />
             </div>

             <div className="w-full max-w-md p-2 bg-black/50 rounded-lg flex items-center justify-between">
                <div className="text-center">
                    <p className="text-sm text-gray-300">Wind</p>
                    <p className="font-bold">2 mph &rarr;</p>
                </div>
                 <Button className="font-bold text-xl px-10 py-6">DRAW</Button>
                <div className="text-center">
                    <p className="text-sm text-gray-300">Arrows</p>
                    <p className="font-bold">3 / 5</p>
                </div>
            </div>
        </main>
      )}

    </div>
  );
}

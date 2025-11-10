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
    <div className="flex flex-col h-screen bg-green-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-green-700">
        <Link href="/games/pool" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">8 Ball Pool</h1>
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
             <div className="w-full max-w-md flex justify-between items-center mb-2">
                 <div className="flex items-center gap-2"><Avatar className="w-10 h-10"><AvatarImage src="https://i.pravatar.cc/150?u=you"/></Avatar><span>You (Solids)</span></div>
                 <div className="flex items-center gap-2"><span>{opponent.name} (Stripes)</span><Avatar className="w-10 h-10"><AvatarImage src={opponent.avatar}/></Avatar></div>
             </div>
            <div className="w-full max-w-lg aspect-video bg-green-700 rounded-lg border-8 border-yellow-800 shadow-2xl relative p-8">
                {/* Pockets */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black rounded-full"></div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-black rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-black rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 bg-black rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 bg-black rounded-full"></div>
                
                {/* Balls */}
                <div className="absolute w-6 h-6 bg-white rounded-full" style={{top: '50%', left: '25%'}}></div>
                <div className="absolute w-6 h-6 bg-black rounded-full" style={{top: '50%', left: '60%'}}></div>
                <div className="absolute w-6 h-6 bg-yellow-500 rounded-full" style={{top: '40%', left: '65%'}}></div>
                <div className="absolute w-6 h-6 bg-blue-500 rounded-full" style={{top: '60%', left: '65%'}}></div>
                <div className="absolute w-6 h-6 bg-red-500 rounded-full" style={{top: '50%', left: '70%'}}></div>
                <div className="absolute w-6 h-6 bg-purple-500 rounded-full" style={{top: '30%', left: '70%'}}></div>
                <div className="absolute w-6 h-6 bg-orange-500 rounded-full" style={{top: '70%', left: '70%'}}></div>
                
            </div>
             <p className="mt-4 animate-pulse">Your turn to break!</p>
        </main>
      )}

    </div>
  );
}

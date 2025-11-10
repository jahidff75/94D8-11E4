'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponents...');
    const [opponent, setOpponent] = useState<{name: string, avatar: string} | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpponent({ name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival' });
            setStatus('Match Starting!');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

  return (
    <div className="flex flex-col h-screen bg-green-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/call_break" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Call Break</h1>
        <div className="w-10"></div>
      </header>

      {!opponent ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                     <div className="flex justify-center items-center -space-x-4">
                        <Avatar className="w-24 h-24 border-4 border-blue-500">
                            <AvatarImage src="https://i.pravatar.cc/150?u=you" />
                            <AvatarFallback>YOU</AvatarFallback>
                        </Avatar>
                        <div className="w-24 h-24 border-4 border-dashed bg-gray-700 border-red-500 rounded-full flex items-center justify-center">
                             <Timer className="w-12 h-12 text-red-500 animate-spin" />
                        </div>
                        <div className="w-24 h-24 border-4 border-dashed bg-gray-700 border-yellow-500 rounded-full flex items-center justify-center">
                             <Timer className="w-12 h-12 text-yellow-500 animate-spin" />
                        </div>
                         <div className="w-24 h-24 border-4 border-dashed bg-gray-700 border-green-500 rounded-full flex items-center justify-center">
                             <Timer className="w-12 h-12 text-green-500 animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-4 bg-green-900/50">
            <div className="w-full max-w-md aspect-video bg-green-700 rounded-2xl border-8 border-yellow-600 shadow-2xl relative p-4 flex flex-col justify-between">
                
                {/* Top Player */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                         <Avatar className="w-12 h-12 border-2"><AvatarImage src="https://i.pravatar.cc/150?u=player2" /></Avatar>
                         <span className="text-xs font-bold">Player 2</span>
                         <div className="flex -space-x-4 mt-1">
                             <div className="w-8 h-12 bg-blue-800 border rounded"></div>
                             <div className="w-8 h-12 bg-blue-800 border rounded"></div>
                         </div>
                    </div>
                </div>

                {/* Middle Players & Deck */}
                <div className="flex justify-between items-center">
                     <div className="flex flex-col items-center">
                         <Avatar className="w-12 h-12 border-2"><AvatarImage src="https://i.pravatar.cc/150?u=player4" /></Avatar>
                         <span className="text-xs font-bold">Player 4</span>
                    </div>
                    <div className="w-16 h-24 bg-white border-2 rounded-lg text-black text-center p-2 font-bold text-xl">
                        A<span className="text-red-600">&hearts;</span>
                    </div>
                     <div className="flex flex-col items-center">
                         <Avatar className="w-12 h-12 border-2"><AvatarImage src="https://i.pravatar.cc/150?u=player3" /></Avatar>
                         <span className="text-xs font-bold">Player 3</span>
                    </div>
                </div>

                {/* Your Hand */}
                <div className="flex flex-col items-center">
                     <div className="flex -space-x-8">
                        <div className="w-16 h-24 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">K♠</div>
                        <div className="w-16 h-24 bg-white border-2 rounded-lg text-black p-1 text-center font-bold text-red-600">Q♦</div>
                        <div className="w-16 h-24 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">J♣</div>
                        <div className="w-16 h-24 bg-white border-2 rounded-lg text-black p-1 text-center font-bold text-red-600">10♥</div>
                     </div>
                     <Avatar className="w-12 h-12 border-2 mt-2"><AvatarImage src="https://i.pravatar.cc/150?u=you" /></Avatar>
                     <span className="text-xs font-bold">You</span>
                </div>
            </div>
             <p className="mt-4 text-lg animate-pulse">Your turn to bid!</p>
        </main>
      )}

    </div>
  );
}

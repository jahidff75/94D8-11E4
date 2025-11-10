'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Table...');
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
        <Link href="/games/poker" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Poker</h1>
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
                    </div>
                    <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-around p-4 bg-cover" style={{backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/poker-green.png')"}}>
            <div className="flex justify-around w-full">
                <div className="flex flex-col items-center"><Avatar className="w-16 h-16"><AvatarImage src="https://i.pravatar.cc/150?u=p1" /></Avatar><span>Player 1</span></div>
                <div className="flex flex-col items-center"><Avatar className="w-16 h-16"><AvatarImage src="https://i.pravatar.cc/150?u=p2" /></Avatar><span>Player 2</span></div>
                <div className="flex flex-col items-center"><Avatar className="w-16 h-16"><AvatarImage src="https://i.pravatar.cc/150?u=p3" /></Avatar><span>Player 3</span></div>
            </div>

            <div className="w-full max-w-lg h-64 bg-green-800/80 rounded-full border-8 border-yellow-700 flex flex-col items-center justify-center">
                <p className="text-lg">Pot: 1,500 Coins</p>
                <div className="flex gap-2 mt-4">
                    <div className="w-12 h-16 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">A♠</div>
                    <div className="w-12 h-16 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">K♠</div>
                    <div className="w-12 h-16 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">Q♠</div>
                    <div className="w-12 h-16 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">J♠</div>
                    <div className="w-12 h-16 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">10♠</div>
                </div>
            </div>
            
            <div className="w-full flex items-center justify-between">
                <div className="flex flex-col items-center">
                    <div className="flex gap-2">
                        <div className="w-14 h-20 bg-blue-800 border-2 rounded-lg -rotate-12"></div>
                        <div className="w-14 h-20 bg-blue-800 border-2 rounded-lg rotate-12"></div>
                    </div>
                    <span>Your Hand</span>
                </div>
                 <div className="flex flex-col gap-2">
                    <Button>Check</Button>
                    <Button variant="destructive">Fold</Button>
                    <Button className="bg-green-600">Raise 200</Button>
                </div>
            </div>

        </main>
      )}

    </div>
  );
}

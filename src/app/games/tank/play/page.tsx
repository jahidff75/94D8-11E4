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
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/tank" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Tank Battle</h1>
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
        <main className="flex-1 flex flex-col items-center justify-center p-4 bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-vector/military-battlefield-landscape-scene_1308-89311.jpg')"}}>
            <div className="w-full max-w-lg aspect-video bg-yellow-800/50 rounded-lg border-4 border-gray-600 shadow-2xl relative p-4 grid grid-cols-10 grid-rows-6 gap-2">
                {/* Your Tank */}
                <div className="col-start-2 row-start-3 text-5xl">💥</div>
                <div className="col-start-1 row-start-4 text-6xl -scale-x-100">⚫️</div>
                <div className="col-start-2 row-start-4 text-6xl">🟩</div>

                {/* Opponent Tank */}
                 <div className="col-start-9 row-start-2 text-6xl">🟥</div>
                 <div className="col-start-10 row-start-2 text-6xl">⚫️</div>
            </div>
            <div className="w-full max-w-lg mt-4 flex justify-between items-center p-4 bg-black/50 rounded-lg">
                <div><p>Angle: 45°</p><p>Power: 70%</p></div>
                <Button className="px-10 py-6 text-xl bg-red-600">FIRE!</Button>
            </div>
        </main>
      )}

    </div>
  );
}

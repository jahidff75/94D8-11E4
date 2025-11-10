'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Heart, Spade, Diamond, Club } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const PlayingCard = ({ rank, suit, isFaceDown }: { rank: string, suit: 'H' | 'S' | 'D' | 'C', isFaceDown?: boolean }) => {
    const color = suit === 'H' || suit === 'D' ? 'text-red-600' : 'text-black';
    const suitIcon = {
        'H': <Heart className="w-4 h-4 fill-current"/>,
        'S': <Spade className="w-4 h-4 fill-current"/>,
        'D': <Diamond className="w-4 h-4 fill-current"/>,
        'C': <Club className="w-4 h-4 fill-current"/>,
    }[suit];

    if(isFaceDown) {
        return <div className="w-20 h-28 bg-blue-800 rounded-lg border-2 border-blue-900"></div>
    }

    return (
        <div className="w-20 h-28 bg-white rounded-lg border-2 p-1 flex flex-col justify-between shadow-md">
            <div className={`font-bold text-xl ${color}`}>{rank}{suitIcon}</div>
            <div className={`font-bold text-xl self-end transform rotate-180 ${color}`}>{rank}{suitIcon}</div>
        </div>
    )
}

export default function GamePlayPage() {
    const [status, setStatus] = useState('Game is starting...');
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

  return (
    <div className="flex flex-col h-screen bg-green-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-green-700 bg-green-900/50 z-10">
        <Link href="/games/solitaire" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Solitaire</h1>
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
        <main className="flex-1 flex flex-col items-center justify-start p-4 space-y-4 bg-green-700">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-lg">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">5,600</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">TIME</p>
                    <p className="text-2xl font-bold">03:21</p>
                </div>
             </div>

             <div className="w-full flex justify-between">
                <div className="flex gap-2">
                    <div className="w-20 h-28 bg-green-900/50 rounded-lg border-2 border-dashed border-white/50 flex items-center justify-center text-2xl font-bold">
                        <Timer />
                    </div>
                    <PlayingCard rank="A" suit="H"/>
                </div>
                <div className="flex gap-2">
                    <div className="w-20 h-28 bg-green-900/50 rounded-lg border-2 border-dashed border-white/50"></div>
                    <div className="w-20 h-28 bg-green-900/50 rounded-lg border-2 border-dashed border-white/50"></div>
                    <div className="w-20 h-28 bg-green-900/50 rounded-lg border-2 border-dashed border-white/50"></div>
                    <div className="w-20 h-28 bg-green-900/50 rounded-lg border-2 border-dashed border-white/50"></div>
                </div>
             </div>
            
            <div className="w-full flex justify-between">
                {Array.from({length: 7}).map((_, i) => (
                    <div key={i} className="relative h-48">
                         {Array.from({length: i+1}).map((_, j) => (
                             <div key={j} className="absolute" style={{top: `${j * 25}px`}}>
                                <PlayingCard rank="K" suit="C" isFaceDown={j < i} />
                             </div>
                         ))}
                    </div>
                ))}
            </div>

        </main>
      )}
    </div>
  );
}

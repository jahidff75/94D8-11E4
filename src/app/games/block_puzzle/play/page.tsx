'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCw, Star, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Block = ({ color }: { color: string }) => (
    <div className={cn("w-full h-full border-2", color)}></div>
)

const BlockShape = ({ shape, color }: { shape: number[][], color: string}) => (
    <div className="grid grid-cols-3 grid-rows-3 w-20 h-20">
        {shape.flat().map((cell, i) => (
            cell ? <Block key={i} color={color}/> : <div key={i}></div>
        ))}
    </div>
)

const shapes = [
    { shape: [[1,1,1],[0,1,0],[0,0,0]], color: 'bg-cyan-500 border-cyan-700' },
    { shape: [[1,1],[1,1]], color: 'bg-yellow-500 border-yellow-700' },
    { shape: [[0,1,0],[0,1,0],[0,1,0]], color: 'bg-purple-500 border-purple-700' },
]

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
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/block_puzzle" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Block Puzzle</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between p-4">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-lg">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">1,250</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">TIME</p>
                    <p className="text-2xl font-bold">02:45</p>
                </div>
             </div>

             <div className="w-full max-w-sm aspect-square bg-gray-800 border-4 border-gray-700 rounded-lg p-1 grid grid-cols-8 grid-rows-8 gap-px">
                {Array.from({length: 64}).map((_, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-sm"></div>
                ))}
             </div>

             <div className="w-full max-w-md p-4 bg-black/30 rounded-lg flex items-center justify-around">
                {shapes.map((s, i) => <BlockShape key={i} shape={s.shape} color={s.color} />)}
            </div>
        </main>
      )}

    </div>
  );
}

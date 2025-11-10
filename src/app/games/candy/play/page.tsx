'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Candy = ({ type }: { type: number }) => {
    const candies = [
        'text-red-500', // Cherry
        'text-blue-500', // Blueberry
        'text-green-500', // Apple
        'text-yellow-500', // Lemon
        'text-purple-500', // Grape
        'text-orange-500' // Orange
    ];
    return <div className={`w-10 h-10 flex items-center justify-center text-4xl font-bold drop-shadow-lg ${candies[type]}`}>&#x25CF;</div>
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
    <div className="flex flex-col h-screen bg-pink-200 text-gray-800">
      <header className="flex items-center justify-between p-2 border-b-2 border-pink-300 bg-pink-100">
        <Link href="/games/candy" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-pink-600">Candy Crush</h1>
        <div className="w-10"></div>
      </header>

      {!isGameStarted ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse text-pink-600">{status}</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin text-pink-500" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-between p-4 bg-pink-50">
             <div className="w-full flex justify-between items-center bg-white/70 p-2 rounded-lg shadow-md">
                <div>
                    <p className="text-sm text-gray-500">SCORE</p>
                    <p className="text-2xl font-bold text-pink-500">15,300</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500">MOVES</p>
                    <p className="text-2xl font-bold text-center">12</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">TARGET</p>
                    <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1"><Star className="fill-yellow-400"/> 25,000</p>
                </div>
             </div>

             <div className="w-full max-w-sm aspect-square bg-pink-100/50 border-4 border-pink-200 rounded-lg p-2 grid grid-cols-7 grid-rows-7 gap-1 my-4">
                {Array.from({length: 49}).map((_, i) => (
                    <div key={i} className="flex items-center justify-center bg-pink-200/50 rounded-md animate-bounce" style={{animationDelay: `${Math.random()*1}s`, animationDuration: '2s'}}>
                        <Candy type={Math.floor(Math.random() * 6)} />
                    </div>
                ))}
             </div>

             <div className="w-full max-w-md p-2 text-center">
                <p className="font-bold text-lg text-pink-700">Combine 3 candies to crush them!</p>
            </div>
        </main>
      )}

    </div>
  );
}

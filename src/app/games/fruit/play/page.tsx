'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Fruit = ({ type, isSliced }: { type: string, isSliced: boolean }) => {
    return <div className={`text-6xl transition-transform duration-300 ${isSliced ? 'rotate-45 opacity-0' : ''}`}>{type}</div>
}

export default function GamePlayPage() {
    const [status, setStatus] = useState('Game is starting...');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [slicedFruits, setSlicedFruits] = useState<number[]>([]);

    const fruits = ['🍎', '🍌', '🍉', '🍓', '🥝', '💣'];

     useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSlice = (index: number) => {
        if(fruits[index] === '💣') {
            // End game logic
            alert('Game Over! You hit a bomb.');
            return;
        }
        setSlicedFruits(prev => [...prev, index]);
    }

  return (
    <div className="flex flex-col h-screen bg-yellow-100 text-gray-800">
      <header className="flex items-center justify-between p-2 border-b-2 border-yellow-200 bg-yellow-50">
        <Link href="/games/fruit" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-orange-600">Fruit Samurai</h1>
        <div className="w-10"></div>
      </header>

      {!isGameStarted ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse text-orange-600">{status}</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin text-orange-500" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-between p-4 bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-photo/bamboo-background_53876-97841.jpg')"}}>
             <div className="w-full flex justify-between items-center bg-black/30 text-white p-2 rounded-lg">
                <div>
                    <p className="text-sm">SCORE</p>
                    <p className="text-2xl font-bold">2,450</p>
                </div>
                <div>
                    <p className="text-sm">TIME</p>
                    <p className="text-2xl font-bold">01:05</p>
                </div>
                 <div>
                    <p className="text-sm">BEST</p>
                    <p className="text-2xl font-bold">3,100</p>
                </div>
             </div>

             <div className="w-full flex-1 my-4 flex items-center justify-center gap-4">
                 {fruits.map((fruit, i) => (
                    <div key={i} className="animate-fruit-toss" style={{animationDelay: `${i*0.5}s`}} onClick={() => handleSlice(i)}>
                        <Fruit type={fruit} isSliced={slicedFruits.includes(i)} />
                    </div>
                 ))}
             </div>

             <div className="w-full max-w-md p-2 text-center">
                <p className="font-bold text-lg text-white">Slice the fruits, avoid the bombs!</p>
            </div>
             <style jsx>{`
                @keyframes fruit-toss {
                    0% { transform: translateY(200%) rotate(0deg); opacity: 1; }
                    50% { transform: translateY(-50%) rotate(180deg); opacity: 1; }
                    100% { transform: translateY(200%) rotate(360deg); opacity: 1; }
                }
                .animate-fruit-toss {
                    position: absolute;
                    animation-name: fruit-toss;
                    animation-duration: 3s;
                    animation-timing-function: ease-out;
                    animation-iteration-count: infinite;
                    cursor: pointer;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

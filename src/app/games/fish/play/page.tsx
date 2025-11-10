'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Fish, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Game is starting...');
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const fishTypes = ['🐟', '🐠', '🐡'];

  return (
    <div className="flex flex-col h-screen bg-blue-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-blue-700 bg-blue-800/50">
        <Link href="/games/fish" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Fish Frenzy</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between bg-cover bg-center overflow-hidden" style={{backgroundImage: "url('https://img.freepik.com/free-vector/underwater-background-with-sun-rays_1017-38668.jpg')"}}>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-b-lg">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">4,200</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">TIME</p>
                    <p className="text-2xl font-bold">01:45</p>
                </div>
             </div>

            {/* Fish swimming around */}
             <div className="w-full h-full relative">
                {Array.from({length: 15}).map((_, i) => (
                    <div key={i} className="absolute text-4xl animate-swim" style={{
                        top: `${Math.random() * 80 + 10}%`,
                        left: '-10%',
                        animationDuration: `${Math.random() * 5 + 5}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})`,
                    }}>
                        {fishTypes[i % 3]}
                    </div>
                ))}
             </div>


             <div className="w-full p-4 text-center bg-black/30 rounded-t-lg">
                <p className="font-bold text-lg">Tap the fish to catch them!</p>
            </div>
            <style jsx>{`
                @keyframes swim {
                    from { left: -10%; }
                    to { left: 110%; }
                }
                .animate-swim {
                    animation-name: swim;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

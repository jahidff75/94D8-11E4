'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Flag } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type OpponentCar = {
    id: number;
    x: number; // %
    y: number; // % from bottom
    speed: number;
    color: string;
}

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [speed, setSpeed] = useState(120);
    const [lap, setLap] = useState(1);
    const [position, setPosition] = useState(4);
    const [gameOver, setGameOver] = useState(false);
    
    const [opponents, setOpponents] = useState<OpponentCar[]>([]);
    const [roadOffset, setRoadOffset] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setIsGameStarted(true);
            setOpponents([
                { id: 1, x: 25, y: 40, speed: 1.1, color: 'bg-blue-600' },
                { id: 2, x: 75, y: 50, speed: 1.0, color: 'bg-green-600' },
                { id: 3, x: 50, y: 60, speed: 0.9, color: 'bg-purple-600' },
            ]);
        }, 3000);
        return () => {};
    }, []);
    
    useEffect(() => {
        if (!isGameStarted || gameOver) return;
        
        const gameLoop = setInterval(() => {
            setRoadOffset(prev => (prev + speed / 50) % 100);
            
            setOpponents(prev => prev.map(op => {
                let newY = op.y - (op.speed - speed / 150);
                if (newY < -20) newY = 120; // reset
                if (newY > 120) newY = -20;
                return {...op, y: newY};
            }));

            // Update position
            const carsInFront = opponents.filter(op => op.y > 10).length;
            setPosition(carsInFront + 1);

        }, 50);
        
        const lapTimer = setInterval(() => {
            setLap(l => {
                if (l >= 3) {
                    setGameOver(true);
                    clearInterval(lapTimer);
                    return 3;
                }
                return l + 1;
            })
        }, 15000); // 15s per lap

        return () => {
            clearInterval(gameLoop);
            clearInterval(lapTimer);
        }

    }, [isGameStarted, gameOver, speed]);


  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900/50 z-10">
        <Link href="/games/racing" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Racing Clash</h1>
        <div className="w-10"></div>
      </header>

      {!isGameStarted ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse">Waiting for Racers...</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-between relative bg-gray-600">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SPEED</p>
                    <p className="text-2xl font-bold text-yellow-400">{speed} KPH</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">LAP</p>
                    <p className="text-2xl font-bold">{lap} / 3</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">POSITION</p>
                    <p className="text-2xl font-bold">{position} / 4</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full perspective-1000 overflow-hidden">
                <div className="absolute inset-0 w-full h-1/2 bg-sky-400"></div>
                <div className="absolute bottom-0 w-full h-1/2 bg-gray-500" style={{ transform: 'rotateX(60deg)', transformOrigin: 'bottom' }}>
                    <div className="absolute inset-0" style={{ 
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #fff 20px, #fff 40px), repeating-linear-gradient(90deg, hsl(0,0%,60%), hsl(0,0%,60%) 48%, hsl(0,0%,50%) 52%, hsl(0,0%,60%) 52%)',
                        backgroundSize: '100px 100%, 100% 100%',
                        backgroundPositionY: `${roadOffset}px`,
                        animation: 'road 0.2s linear infinite'
                    }}></div>
                </div>
            </div>
            
            {/* Player Car */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-24 h-32 bg-red-600 rounded-t-lg border-4 border-black animate-car-bob">
                <div className="w-full h-8 bg-red-800"></div>
            </div>

            {/* Opponent Cars */}
            {opponents.map(op => (
                <div 
                    key={op.id}
                    className="absolute z-10 w-20 h-28 rounded-t-lg border-4 border-black"
                    style={{
                        left: `${op.x}%`,
                        bottom: `${op.y}%`,
                        backgroundColor: op.color,
                        transform: `translateX(-50%) scale(${Math.max(0.2, op.y / 100)})`,
                        zIndex: Math.floor(op.y)
                    }}
                >
                     <div className="w-full h-6" style={{backgroundColor: op.color}}></div>
                </div>
            ))}
            
            {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <Flag className="w-24 h-24 text-white" />
                    <h2 className="text-4xl font-bold text-white mt-4">Finished!</h2>
                    <p className="text-2xl text-yellow-400">Your Position: #{position}</p>
                    <Link href="/games/racing" passHref>
                        <Button className="mt-6">Race Again</Button>
                    </Link>
                 </div>
             )}


             <div className="absolute bottom-0 w-full p-4 flex justify-between z-20">
                <Button onMouseDown={() => setSpeed(s => s > 60 ? s - 20 : s)} onMouseUp={() => setSpeed(s => Math.min(120, s + 10))} className="font-bold text-2xl px-8 py-8 rounded-full">BRAKE</Button>
                <Button onMouseDown={() => setSpeed(s => Math.min(220, s + 30))} onMouseUp={() => setSpeed(120)} className="font-bold text-2xl px-8 py-8 rounded-full bg-blue-600">NITRO</Button>
            </div>

             <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                 @keyframes car-bob {
                    0%, 100% { transform: translateY(0) translateX(-50%); }
                    50% { transform: translateY(-3px) translateX(-50%); }
                }
                .animate-car-bob { animation: car-bob 0.5s ease-in-out infinite; }
             `}</style>
        </main>
      )}

    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Flag } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type OpponentCar = {
    id: number;
    lane: number; // 0, 1, 2
    y: number; // % from top
    speed: number;
}

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
    const [gameOver, setGameOver] = useState(false);
    
    const [opponents, setOpponents] = useState<OpponentCar[]>([]);
    const [roadOffset, setRoadOffset] = useState(0);

    useEffect(() => {
        setTimeout(() => setIsGameStarted(true), 3000);
    }, []);

    // Player controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver) return;
            if (e.key === 'ArrowLeft') setPlayerLane(l => Math.max(0, l - 1));
            if (e.key === 'ArrowRight') setPlayerLane(l => Math.min(2, l + 1));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver]);
    
    // Game Loop
    useEffect(() => {
        if (!isGameStarted || gameOver) return;
        
        const gameSpeed = 200; // Base speed
        
        const gameLoop = setInterval(() => {
            setRoadOffset(prev => (prev + gameSpeed / 50) % 100);
            setScore(s => s + 1);

            // Move opponents and check for collision
            setOpponents(prev => {
                const newOpponents: OpponentCar[] = [];
                for(const op of prev) {
                    let newY = op.y + op.speed;
                    if (newY > 110) continue; // Remove car
                    
                    // Collision detection
                    if (op.lane === playerLane && newY > 70 && newY < 95) {
                        setGameOver(true);
                    }
                    newOpponents.push({ ...op, y: newY });
                }
                return newOpponents;
            });

        }, 50);
        
        // Opponent spawner
        const opponentSpawner = setInterval(() => {
            setOpponents(prev => [...prev, {
                id: Math.random(),
                lane: Math.floor(Math.random() * 3),
                y: -20,
                speed: Math.random() * 1 + 1, // Varies speed
            }]);
        }, 2000);

        return () => {
            clearInterval(gameLoop);
            clearInterval(opponentSpawner);
        }

    }, [isGameStarted, gameOver, playerLane]);


  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900/50 z-10">
        <Link href="/games/street_racer" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Street Racer</h1>
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
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score}</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full perspective-1000 overflow-hidden">
                <div className="absolute inset-0 w-full h-1/2 bg-gray-800 bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-vector/night-city-skyline-background_1048-11538.jpg')"}}></div>
                <div className="absolute bottom-0 w-full h-1/2 bg-gray-500" style={{ transform: 'rotateX(60deg)', transformOrigin: 'bottom' }}>
                     <div className="absolute inset-0" style={{ 
                        backgroundImage: `repeating-linear-gradient(
                            #4a5568 0px, #4a5568 100%,
                            #4a5568 100%, #4a5568 33.33%,
                            #cbd5e0 33.33%, #cbd5e0 34.33%,
                            #4a5568 34.33%, #4a5568 66.66%,
                            #cbd5e0 66.66%, #cbd5e0 67.66%,
                            #4a5568 67.66%, #4a5568 100%
                        )`,
                        backgroundSize: '100% 100px',
                        backgroundPositionY: `${roadOffset}px`,
                    }}></div>
                </div>
            </div>
            
            {/* Player Car */}
            <div className="absolute bottom-[15%] w-24 h-32 z-10 transition-all duration-200" style={{ left: `${25 + playerLane * 25}%`, transform: 'translateX(-50%)' }}>
                 <img src="https://assets.stickpng.com/images/580b585b2edb16999085521e.png" alt="Race Car" className="w-full h-full object-contain drop-shadow-lg" />
            </div>

            {/* Opponent Cars */}
            {opponents.map(op => (
                <div 
                    key={op.id}
                    className="absolute z-10 w-20 h-28 opacity-90"
                    style={{
                        left: `${25 + op.lane * 25}%`,
                        top: `${op.y}%`,
                        transform: `translateX(-50%)`,
                    }}
                >
                    <img src="https://assets.stickpng.com/images/580b585b2edb16999085521e.png" alt="Opponent Car" className="w-full h-full object-contain -scale-x-100 drop-shadow-lg" />
                </div>
            ))}

            {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <Flag className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">CRASHED!</h2>
                    <p className="text-xl text-white">Your Score: {score}</p>
                    <Link href="/games/street_racer" passHref>
                        <Button className="mt-6">Try Again</Button>
                    </Link>
                 </div>
             )}

             <div className="absolute bottom-0 w-full p-4 flex justify-between z-20">
                <Button onClick={() => setPlayerLane(l => Math.max(0, l - 1))} className="font-bold text-2xl px-8 py-8 rounded-full">LEFT</Button>
                <Button onClick={() => setPlayerLane(l => Math.min(2, l + 1))} className="font-bold text-2xl px-8 py-8 rounded-full">RIGHT</Button>
            </div>

             <style jsx>{`
                .perspective-1000 { perspective: 800px; }
             `}</style>
        </main>
      )}

    </div>
  );
}

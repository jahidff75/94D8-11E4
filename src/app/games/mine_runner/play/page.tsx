'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, XCircle, Gem } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type GameObject = {
    id: number;
    type: 'gem' | 'rock' | 'bat';
    x: number;
    y: number;
}

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [distance, setDistance] = useState(0);
    const [gems, setGems] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [objects, setObjects] = useState<GameObject[]>([]);
    const objectIdCounter = useRef(0);
    const gameSpeed = 3;

    useEffect(() => {
        setTimeout(() => setIsGameStarted(true), 1500);
    }, []);

    // Player jump
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping) {
                setIsJumping(true);
                setTimeout(() => setIsJumping(false), 600); // Jump duration
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isJumping]);
    
    // Game loop
    useEffect(() => {
        if (!isGameStarted || gameOver) return;
        
        const gameInterval = setInterval(() => {
            setDistance(d => d + 1);

            let collision = false;
            setObjects(prev => {
                const newObjects = prev.map(obj => ({...obj, x: obj.x - gameSpeed}));

                newObjects.forEach(obj => {
                    if (obj.x > 20 && obj.x < 30) { // Collision zone
                        if (obj.type === 'gem' && Math.abs(obj.y - (isJumping ? 40 : 15)) < 10) {
                            setGems(g => g + 1);
                            obj.x = -100; // "collect" it
                        }
                        if (obj.type === 'rock' && !isJumping && obj.y > 50) {
                           collision = true;
                        }
                        if (obj.type === 'bat' && isJumping && obj.y < 50) {
                           collision = true;
                        }
                    }
                });
                if (collision) setGameOver(true);

                return newObjects.filter(obj => obj.x > -10);
            });

        }, 50);

        const spawner = setInterval(() => {
            const type = Math.random() > 0.3 ? (Math.random() > 0.4 ? 'rock' : 'bat') : 'gem';
            setObjects(prev => [...prev, {
                id: objectIdCounter.current++,
                type: type,
                x: 100,
                y: type === 'bat' ? 40 : (type === 'gem' ? (Math.random() > 0.5 ? 40 : 80) : 80),
            }]);
        }, 1800);

        return () => {
            clearInterval(gameInterval);
            clearInterval(spawner);
        };
    }, [isGameStarted, gameOver, isJumping]);


  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900/50 z-10">
        <Link href="/games/mine_runner" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Mine Runner</h1>
        <div className="w-10"></div>
      </header>

      {!isGameStarted ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse">Game is starting...</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-between relative bg-yellow-900/50" onClick={() => { if (!isJumping) {setIsJumping(true); setTimeout(() => setIsJumping(false), 600);}}}>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">DISTANCE</p>
                    <p className="text-2xl font-bold text-yellow-400">{distance} m</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">GEMS</p>
                    <p className="text-2xl font-bold text-cyan-400">{gems}</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full bg-repeat-x animate-bg-pan" style={{backgroundImage: "url('https://img.freepik.com/free-vector/cave-background-scene_1308-95333.jpg?w=1380')", backgroundSize: 'auto 100%'}}></div>
            
            {/* Character in a minecart */}
            <div className={`absolute left-[20%] z-10 transition-all duration-200 ${isJumping ? 'bottom-24' : 'bottom-16'}`}>
                 <div className="w-20 h-16 bg-yellow-700 border-4 border-yellow-900 rounded-t-lg relative flex justify-center animate-cart-bob">
                    <div className="w-10 h-10 bg-blue-500 rounded-full absolute -top-5"></div>
                    <div className="absolute -bottom-3 left-1 w-6 h-6 bg-gray-600 rounded-full border-2 border-black"></div>
                    <div className="absolute -bottom-3 right-1 w-6 h-6 bg-gray-600 rounded-full border-2 border-black"></div>
                 </div>
            </div>

            {/* Objects */}
            {objects.map(obj => (
                <div 
                    key={obj.id} 
                    className="absolute text-4xl z-10" 
                    style={{ left: `${obj.x}%`, top: `${obj.y - 10}%`}}
                >
                    {obj.type === 'gem' ? '💎' : (obj.type === 'rock' ? '🪨' : '🦇')}
                </div>
            ))}
            
            {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over!</h2>
                    <p className="text-xl text-white">Distance: {distance}m</p>
                    <p className="text-xl text-white">Gems: {gems}</p>
                    <Link href="/games/mine_runner" passHref>
                        <Button className="mt-6">Try Again</Button>
                    </Link>
                 </div>
             )}


             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Tap or Press Space to Jump!</p>
            </div>

             <style jsx>{`
                @keyframes bg-pan {
                    0% { background-position: 0% 50%; }
                    100% { background-position: -200% 50%; }
                }
                .animate-bg-pan {
                    animation: bg-pan 20s linear infinite;
                }
                @keyframes cart-bob {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-2px) rotate(1deg); }
                    75% { transform: translateY(-2px) rotate(-1deg); }
                }
                .animate-cart-bob {
                    animation: cart-bob 0.8s ease-in-out infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

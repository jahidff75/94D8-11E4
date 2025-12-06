'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type Obstacle = {
    id: number;
    type: 'rock' | 'branch'; // rock on ground, branch in air
    x: number; // position from right edge
}

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const gameSpeed = 5;
    const obstacleCounter = useRef(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsGameStarted(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Player Jump
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping) {
                setIsJumping(true);
                setTimeout(() => setIsJumping(false), 500); // 500ms jump duration
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isJumping]);
    
    // Game Loop
    useEffect(() => {
        if (!isGameStarted || gameOver) return;
        
        const gameInterval = setInterval(() => {
            setScore(s => s + 1);

            // Move obstacles and check for collision
            let collision = false;
            setObstacles(prev => {
                const newObstacles = prev.map(obs => ({...obs, x: obs.x - gameSpeed}));
                
                newObstacles.forEach(obs => {
                    if (obs.x > 40 && obs.x < 55) { // collision x-zone
                        if (obs.type === 'rock' && !isJumping) {
                           collision = true;
                        }
                        if (obs.type === 'branch' && isJumping) {
                           collision = true;
                        }
                    }
                });

                return newObstacles.filter(obs => obs.x > -10);
            });

            if (collision) {
                setGameOver(true);
            }

        }, 50);

        // Obstacle Spawner
        const spawner = setInterval(() => {
            setObstacles(prev => [...prev, {
                id: obstacleCounter.current++,
                type: Math.random() > 0.5 ? 'rock' : 'branch',
                x: 100, // start from right edge
            }]);
        }, 2000);

        return () => {
            clearInterval(gameInterval);
            clearInterval(spawner);
        };
    }, [isGameStarted, gameOver, isJumping]);


  return (
    <div className="flex flex-col h-screen bg-green-900 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-green-700 bg-green-800/50 z-10">
        <Link href="/games/jungle_run" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Jungle Run</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between relative" onClick={() => { if (!isJumping) {setIsJumping(true); setTimeout(() => setIsJumping(false), 500);}}}>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score} m</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full bg-cover animate-bg-pan" style={{backgroundImage: "url('https://img.freepik.com/free-vector/jungle-game-background_1047-307.jpg?w=1380')"}}></div>
            
            {/* Player Character */}
            <div className={`absolute bottom-12 left-1/4 z-10 transition-transform duration-200 ${isJumping ? '-translate-y-24' : 'translate-y-0'}`}>
                <div className="w-16 h-24 bg-blue-500 rounded-t-full relative animate-run">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-200 rounded-full"></div>
                </div>
            </div>

            {/* Obstacles */}
            {obstacles.map(obs => (
                <div key={obs.id} className="absolute z-10" style={{ left: `${obs.x}%`, bottom: obs.type === 'rock' ? '2rem' : '7rem' }}>
                    <div className={`w-12 h-12 ${obs.type === 'rock' ? 'bg-gray-700' : 'bg-yellow-800'}`}></div>
                </div>
            ))}
            
            {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Your Score: {score}</p>
                    <Link href="/games/jungle_run" passHref>
                        <Button className="mt-6">Run Again</Button>
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
                    animation: bg-pan 10s linear infinite;
                }
                @keyframes run {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.05); }
                }
                .animate-run {
                    animation: run 0.5s linear infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

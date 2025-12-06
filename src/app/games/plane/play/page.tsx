'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type GameObject = {
    id: number;
    x: number;
    y: number;
    type: 'bullet' | 'enemy';
}

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [playerPos, setPlayerPos] = useState({ x: 50 }); // x in percentage
    const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
    const objectIdCounter = useRef(0);
    const gameAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsGameStarted(true), 1500);
        return () => clearTimeout(timer);
    }, []);
    
    // Player movement
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if(gameOver) return;
        setPlayerPos(prev => {
          if (e.key === 'ArrowLeft') return { x: Math.max(0, prev.x - 5) };
          if (e.key === 'ArrowRight') return { x: Math.min(100, prev.x + 5) };
          return prev;
        });
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver]);


    // Game Loop
    useEffect(() => {
        if (!isGameStarted || gameOver) return;

        const gameInterval = setInterval(() => {
            const newGameObjects: GameObject[] = [];
            let newLives = lives;

            gameObjects.forEach(obj => {
                let newY = obj.y;
                if (obj.type === 'bullet') {
                    newY -= 5;
                } else if (obj.type === 'enemy') {
                    newY += 2;
                }

                if (newY > -10 && newY < 110) {
                     // Collision Detection (simplified)
                    if(obj.type === 'enemy' && Math.abs(obj.x - playerPos.x) < 10 && obj.y > 80) {
                        newLives--;
                        // Don't add enemy back
                    } else if (obj.type === 'bullet') {
                        let hit = false;
                        gameObjects.forEach(enemy => {
                            if(enemy.type === 'enemy' && Math.abs(enemy.x - obj.x) < 5 && Math.abs(enemy.y - obj.y) < 5) {
                                setScore(s => s + 100);
                                hit = true;
                                // Don't add bullet or enemy back
                            }
                        });
                        if(!hit) newGameObjects.push({ ...obj, y: newY });
                    } else {
                         newGameObjects.push({ ...obj, y: newY });
                    }
                }
            });
            
            setGameObjects(newGameObjects);
            if (newLives < lives) setLives(newLives);
            if (newLives <= 0) setGameOver(true);

        }, 50);

        const enemySpawner = setInterval(() => {
            const newEnemy: GameObject = {
                id: objectIdCounter.current++,
                x: Math.random() * 90 + 5,
                y: -5,
                type: 'enemy',
            };
            setGameObjects(prev => [...prev, newEnemy]);
        }, 2000);
        
        const shootInterval = setInterval(() => {
          const newBullet: GameObject = {
            id: objectIdCounter.current++,
            x: playerPos.x,
            y: 85,
            type: 'bullet',
          };
          setGameObjects(prev => [...prev, newBullet]);
        }, 500);

        return () => {
            clearInterval(gameInterval);
            clearInterval(enemySpawner);
            clearInterval(shootInterval);
        };
    }, [isGameStarted, gameOver, gameObjects, playerPos, lives]);


  return (
    <div className="flex flex-col h-screen bg-cyan-700 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-cyan-600 bg-cyan-800/50 z-10">
        <Link href="/games/plane" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Plane Mayhem</h1>
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
        <main ref={gameAreaRef} className="flex-1 flex flex-col items-center justify-between relative bg-cyan-400">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">LIVES</p>
                    <p className="text-2xl font-bold text-red-500">{Array(lives).fill('❤️').join('')}</p>
                </div>
             </div>

            <div className="absolute inset-0 w-full h-full bg-repeat-y animate-bg-pan" style={{backgroundImage: "url('https://img.freepik.com/free-vector/sky-background-video-conferencing_23-2148639332.jpg')", backgroundSize: '100% auto'}}></div>
            
            {/* Player Plane */}
            <div className="absolute bottom-[10%] text-6xl transition-all duration-100" style={{ left: `${playerPos.x}%`, transform: `translateX(-50%)` }}>
                ✈️
            </div>

            {/* Game Objects */}
            {gameObjects.map(obj => (
                <div
                    key={obj.id}
                    className="absolute text-3xl"
                    style={{ top: `${obj.y}%`, left: `${obj.x}%`, transform: 'translateX(-50%)' }}
                >
                    {obj.type === 'bullet' ? '🔥' : '🚀'}
                </div>
            ))}
            
            {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/plane" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}


             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Use Arrow Keys to Move & Shoot!</p>
            </div>

             <style jsx>{`
                @keyframes bg-pan {
                    0% { background-position: 50% 0%; }
                    100% { background-position: 50% 200%; }
                }
                .animate-bg-pan {
                    animation: bg-pan 10s linear infinite;
                }
            `}</style>
        </main>
      )}
    </div>
  );
}

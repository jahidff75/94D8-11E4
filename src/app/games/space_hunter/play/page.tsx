'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

type GameObject = {
    id: number;
    x: number;
    y: number;
    type: 'bullet' | 'asteroid';
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
      const handleMouseMove = (e: MouseEvent) => {
        if(gameOver || !gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setPlayerPos({ x: Math.max(5, Math.min(95, x)) });
      };
      
      const gameArea = gameAreaRef.current;
      gameArea?.addEventListener('mousemove', handleMouseMove);
      return () => gameArea?.removeEventListener('mousemove', handleMouseMove);
    }, [isGameStarted, gameOver]);


    // Game Loop
    useEffect(() => {
        if (!isGameStarted || gameOver) return;

        const gameInterval = setInterval(() => {
            const newGameObjects: GameObject[] = [];
            let newLives = lives;

            gameObjects.forEach(obj => {
                let newY = obj.y;
                if (obj.type === 'bullet') newY -= 2;
                else if (obj.type === 'asteroid') newY += 1;

                if (newY > -10 && newY < 110) {
                     // Collision Detection
                    if(obj.type === 'asteroid' && Math.abs(obj.x - playerPos.x) < 8 && obj.y > 85) {
                        newLives--;
                    } else {
                        let hit = false;
                        if(obj.type === 'bullet') {
                             for(const asteroid of gameObjects) {
                                 if (asteroid.type === 'asteroid' && Math.abs(asteroid.x - obj.x) < 5 && Math.abs(asteroid.y - obj.y) < 5) {
                                     setScore(s => s + 50);
                                     hit = true;
                                     // Remove asteroid by not adding it back
                                     setGameObjects(prev => prev.filter(o => o.id !== asteroid.id));
                                     break;
                                 }
                             }
                        }
                        if(!hit) newGameObjects.push({ ...obj, y: newY });
                    }
                }
            });
            
            setGameObjects(prev => prev.filter(obj => newGameObjects.some(newObj => newObj.id === obj.id)));
            if (newLives < lives) setLives(newLives);
            if (newLives <= 0) setGameOver(true);

        }, 50);

        const enemySpawner = setInterval(() => {
            const newEnemy: GameObject = {
                id: objectIdCounter.current++,
                x: Math.random() * 90 + 5,
                y: -5,
                type: 'asteroid',
            };
            setGameObjects(prev => [...prev, newEnemy]);
        }, 1500);
        
        const shootInterval = setInterval(() => {
          const newBullet: GameObject = {
            id: objectIdCounter.current++,
            x: playerPos.x,
            y: 85,
            type: 'bullet',
          };
          setGameObjects(prev => [...prev, newBullet]);
        }, 400);

        return () => {
            clearInterval(gameInterval);
            clearInterval(enemySpawner);
            clearInterval(shootInterval);
        };
    }, [isGameStarted, gameOver, playerPos, lives]);


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800/50 z-10">
        <Link href="/games/space_hunter" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Space Hunter</h1>
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
        <main ref={gameAreaRef} className="flex-1 flex flex-col items-center justify-between relative bg-black cursor-none">
             <div className="absolute inset-0 w-full h-full bg-repeat animate-bg-pan opacity-30" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"}}></div>
             <div className="w-full flex justify-between items-center bg-black/30 p-2 z-10">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">LIVES</p>
                    <p className="text-2xl font-bold text-red-500">{Array(lives).fill('🚀').join('')}</p>
                </div>
             </div>

            
            {/* Player ship */}
            <div className="absolute bottom-[10%] text-6xl" style={{ left: `${playerPos.x}%`, transform: 'translateX(-50%)' }}>
                🛸
            </div>
            
             {/* Game Objects */}
            {gameObjects.map(obj => (
                <div
                    key={obj.id}
                    className="absolute text-4xl"
                    style={{ top: `${obj.y}%`, left: `${obj.x}%`, transform: 'translateX(-50%) rotate(45deg)' }}
                >
                    {obj.type === 'bullet' ? '💥' : '☄️'}
                </div>
            ))}

            {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/space_hunter" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}


             <div className="absolute bottom-0 w-full p-4 text-center z-10">
                <p className="font-bold text-lg">Move mouse to control ship!</p>
            </div>

             <style jsx>{`
                @keyframes bg-pan {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 0% 200%; }
                }
                .animate-bg-pan {
                    animation: bg-pan 20s linear infinite;
                }
            `}</style>
        </main>
      )}

    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, XCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [stage, setStage] = useState(1);
    const [knives, setKnives] = useState(7);
    const [stuckKnives, setStuckKnives] = useState<{ angle: number }[]>([]);
    const [targetRotation, setTargetRotation] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [status, setStatus] = useState('Game is starting...');
    
    const targetContent = useMemo(() => ['🍉', '🍎', '🍍', '🍊', '🍓'][stage % 5], [stage]);

    useEffect(() => {
        const timer = setTimeout(() => setIsGameStarted(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isGameStarted && !gameOver) {
            const rotationSpeed = 1 + stage * 0.2;
            const rotationInterval = setInterval(() => {
                setTargetRotation(prev => (prev + rotationSpeed) % 360);
            }, 16);
            return () => clearInterval(rotationInterval);
        }
    }, [isGameStarted, gameOver, stage]);
    
    useEffect(() => {
      if(knives === 0 && stuckKnives.length === 7) {
        // Stage complete
        setTimeout(() => {
          setStage(s => s + 1);
          setKnives(7);
          setStuckKnives([]);
          setScore(s => s + 100);
        }, 1000);
      }
    }, [knives, stuckKnives]);

    const handleThrow = () => {
        if (knives === 0 || gameOver) return;

        const newAngle = targetRotation % 360;
        
        // Check for collision
        for (const stuck of stuckKnives) {
            const diff = Math.abs(newAngle - stuck.angle);
            if (Math.min(diff, 360 - diff) < 15) { // 15 degrees collision threshold
                setGameOver(true);
                setStatus('Game Over! You hit another knife.');
                return;
            }
        }

        setKnives(k => k - 1);
        setScore(s => s + 10);
        setStuckKnives(prev => [...prev, { angle: newAngle }]);
    };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/knife_up" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Knife Up</h1>
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
        <main className="flex-1 flex flex-col items-center justify-around p-4 bg-gray-900">
            <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-lg">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">STAGE</p>
                    <p className="text-2xl font-bold">{stage}</p>
                </div>
            </div>

            <div className="relative w-48 h-48">
                <div 
                    className="w-full h-full bg-yellow-100 rounded-full flex items-center justify-center font-bold text-6xl text-black"
                    style={{ transform: `rotate(${targetRotation}deg)`}}
                >
                   {targetContent}
                </div>
                {/* Knives stuck in the target */}
                {stuckKnives.map((knife, i) => (
                    <div 
                        key={i} 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-4xl origin-bottom"
                        style={{ transform: `rotate(${knife.angle}deg) translateY(-80px)`}}
                    >
                        🔪
                    </div>
                ))}
            </div>
            
            {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <XCircle className="w-24 h-24 text-red-500" />
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Your score: {score}</p>
                    <Link href="/games/knife_up" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

            <div className="flex flex-col items-center gap-4">
                <div className="text-5xl animate-bounce">🔪</div>
                <div className="flex gap-2">
                  {Array.from({length: knives}).map((_, i) => <span key={i} className="text-2xl">🔪</span>)}
                </div>
                <Button onClick={handleThrow} disabled={gameOver || knives === 0} className="font-bold text-2xl px-12 py-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-500">THROW</Button>
            </div>
        </main>
      )}

    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponent...');
    const [opponent, setOpponent] = useState<{name: string, avatar: string} | null>(null);
    const [score, setScore] = useState({ you: 0, opponent: 0 });
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    
    // Simplified game state
    const [puck, setPuck] = useState({ x: 50, y: 50 });
    const [playerPaddle, setPlayerPaddle] = useState({ x: 50, y: 85 });
    const gameAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpponent({ name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival' });
            setStatus('Match Starting!');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!opponent || gameOver) return;

        // Game timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameOver(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Very basic game loop simulation
        const gameLoop = setInterval(() => {
            // Simulate AI paddle movement
            // Simulate puck movement
            setPuck(prev => {
                let newY = prev.y - 1; // Puck moves towards player
                if (newY < 5) { // AI scores
                    setScore(s => ({ ...s, opponent: s.opponent + 1 }));
                    return { x: 50, y: 50 }; // Reset
                }
                // Basic collision with player paddle
                if (newY > 80 && Math.abs(prev.x - playerPaddle.x) < 10) {
                   newY = 50; // bounce back
                   setScore(s => ({ ...s, you: s.you + 1 })); // player scores
                }
                return { ...prev, y: newY };
            });
        }, 100);

        return () => {
            clearInterval(timer);
            clearInterval(gameLoop);
        };
    }, [opponent, gameOver, playerPaddle.x]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (gameAreaRef.current) {
            const rect = gameAreaRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            setPlayerPaddle(p => ({ ...p, x: Math.max(10, Math.min(90, x)) }));
        }
    };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/air_hockey" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Air Hockey</h1>
        <div className="w-10"></div>
      </header>

      {!opponent ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                     <div className="flex justify-center items-center space-x-8">
                        <Avatar className="w-24 h-24 border-4 border-blue-500">
                            <AvatarImage src="https://i.pravatar.cc/150?u=you" />
                            <AvatarFallback>YOU</AvatarFallback>
                        </Avatar>
                        <span className="text-4xl font-bold text-primary animate-pulse">VS</span>
                        <div className="w-24 h-24 border-4 border-dashed border-red-500 rounded-full flex items-center justify-center">
                             <Timer className="w-12 h-12 text-red-500 animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md aspect-[9/16] bg-blue-900 rounded-2xl border-8 border-gray-400 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Scores */}
                <div className="flex justify-between p-4">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-10 h-10 border-2 border-red-500"><AvatarImage src={opponent.avatar} /></Avatar>
                        <span className="font-bold text-lg">{score.opponent}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{score.you}</span>
                         <Avatar className="w-10 h-10 border-2 border-blue-500"><AvatarImage src="https://i.pravatar.cc/150?u=you" /></Avatar>
                    </div>
                </div>

                {/* Game Area */}
                <div 
                    ref={gameAreaRef}
                    className="flex-1 bg-blue-700 m-2 rounded-lg relative border-4 border-white/50 cursor-none"
                    onMouseMove={handleMouseMove}
                >
                    {/* Center Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/30"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-white/30 rounded-full"></div>
                    
                    {/* Goals */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-red-800"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-blue-800"></div>

                    {/* Puck */}
                    <div className="absolute w-6 h-6 bg-black rounded-full border-2 border-white" style={{ top: `${puck.y}%`, left: `${puck.x}%`, transform: 'translate(-50%, -50%)' }}></div>

                    {/* Paddles */}
                    <div className="absolute w-12 h-12 bg-red-600 rounded-full border-4 border-white shadow-lg" style={{ top: '15%', left: `${puck.x}%`, transform: 'translate(-50%, -50%)', transition: 'left 0.1s linear' }}></div>
                    <div className="absolute w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-lg" style={{ top: `${playerPaddle.y}%`, left: `${playerPaddle.x}%`, transform: 'translate(-50%, -50%)' }}></div>
                </div>

                <div className="p-2 text-center">
                    <p className="font-mono text-2xl">{timeLeft}</p>
                </div>
            </div>
            {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className="text-xl text-white">Final Score: You {score.you} - {score.opponent} Opponent</p>
                    <Link href="/games/air_hockey" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}
        </main>
      )}

    </div>
  );
}

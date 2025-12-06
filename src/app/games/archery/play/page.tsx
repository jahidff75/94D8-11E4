'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer, XCircle, Wind } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponent...');
    const [opponent, setOpponent] = useState<{name: string, avatar: string} | null>(null);
    const [score, setScore] = useState({ you: 0, opponent: 0 });
    const [arrowsLeft, setArrowsLeft] = useState(5);
    const [wind, setWind] = useState({ speed: 0, direction: 1 });
    const [isAiming, setIsAiming] = useState(false);
    const [shotResult, setShotResult] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpponent({ name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival' });
            setStatus('Match Starting!');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!opponent || arrowsLeft === 0) return;
        setWind({ speed: Math.round(Math.random() * 5), direction: Math.random() > 0.5 ? 1 : -1 });
    }, [opponent, arrowsLeft]);

    const handleDraw = () => {
        if (arrowsLeft === 0) return;
        setIsAiming(true);
        setShotResult(null);

        // Simulate taking a shot
        setTimeout(() => {
            const points = Math.floor(Math.random() * 6) + 5; // Score between 5 and 10
            setShotResult(points);
            setScore(s => ({...s, you: s.you + points }));
            
            // Simulate opponent's shot
            setTimeout(() => {
                const opponentPoints = Math.floor(Math.random() * 7) + 4;
                setScore(s => ({...s, opponent: s.opponent + opponentPoints }));
                setArrowsLeft(a => a - 1);
                setIsAiming(false);
            }, 1500)

        }, 2000);
    };

    const isGameOver = arrowsLeft === 0 && !isAiming;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/archery" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Archery King</h1>
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
        <main className="flex-1 flex flex-col items-center justify-between p-4 bg-cover bg-center" style={{backgroundImage: "url('https://img.freepik.com/free-vector/archery-range-with-targets-field_107791-4433.jpg?w=1380')"}}>
             <div className="w-full flex justify-between items-start">
                <div className="flex items-center gap-2 p-2 bg-black/50 rounded-lg">
                     <Avatar className="w-10 h-10 border-2 border-blue-500"><AvatarImage src="https://i.pravatar.cc/150?u=you" /></Avatar>
                     <div>
                         <p className="font-bold">You</p>
                         <p className="text-lg font-bold text-yellow-400">{score.you}</p>
                     </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-black/50 rounded-lg">
                     <div>
                         <p className="font-bold">{opponent.name}</p>
                         <p className="text-lg font-bold text-yellow-400">{score.opponent}</p>
                     </div>
                     <Avatar className="w-10 h-10 border-2 border-red-500"><AvatarImage src={opponent.avatar} /></Avatar>
                </div>
             </div>

             <div className="relative h-48 w-48 flex items-center justify-center">
                {isAiming && shotResult === null && <p className="text-2xl font-bold text-white drop-shadow-lg animate-pulse">Aiming...</p>}
                {shotResult !== null && (
                    <div className="text-center">
                        <p className={cn("text-5xl font-bold text-white drop-shadow-lg animate-ping", shotResult > 8 && "text-yellow-300")}>{shotResult}</p>
                        <Star className="text-yellow-400 w-24 h-24 fill-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
                    </div>
                )}
             </div>

            {isGameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <h2 className="text-4xl font-bold text-white mt-4">Game Over</h2>
                    <p className={cn("text-2xl font-bold mt-2", score.you > score.opponent ? "text-green-400" : "text-red-400")}>{score.you > score.opponent ? 'You Win!' : 'You Lose'}</p>
                    <p className="text-xl text-white">Final Score: You {score.you} - {score.opponent} Opponent</p>
                    <Link href="/games/archery" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

             <div className="w-full max-w-md p-2 bg-black/50 rounded-lg flex items-center justify-between">
                <div className="text-center">
                    <p className="text-sm text-gray-300 flex items-center gap-1"><Wind/> Wind</p>
                    <p className="font-bold">{wind.speed} mph {wind.direction > 0 ? '→' : '←'}</p>
                </div>
                 <Button onClick={handleDraw} disabled={isAiming || isGameOver} className="font-bold text-xl px-10 py-6">
                    {isAiming ? 'Shooting...' : 'DRAW'}
                 </Button>
                <div className="text-center">
                    <p className="text-sm text-gray-300">Arrows</p>
                    <p className="font-bold">{arrowsLeft} / 5</p>
                </div>
            </div>
        </main>
      )}

    </div>
  );
}

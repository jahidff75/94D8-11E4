'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Ball = {
    id: number;
    type: 'solid' | 'stripe' | 'eight' | 'cue';
    color: string;
    x: number;
    y: number;
    potted: boolean;
};

const initialBalls: Ball[] = [
    { id: 1, type: 'solid', color: 'bg-yellow-500', x: 65, y: 50, potted: false },
    { id: 2, type: 'solid', color: 'bg-blue-500', x: 68, y: 45, potted: false },
    { id: 3, type: 'solid', color: 'bg-red-500', x: 68, y: 55, potted: false },
    { id: 8, type: 'eight', color: 'bg-black', x: 71, y: 50, potted: false },
    { id: 9, type: 'stripe', color: 'bg-yellow-300', x: 74, y: 40, potted: false },
    { id: 10, type: 'stripe', color: 'bg-blue-300', x: 74, y: 60, potted: false },
    { id: 0, type: 'cue', color: 'bg-white', x: 25, y: 50, potted: false },
];

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponent...');
    const [opponent, setOpponent] = useState<{name: string, avatar: string} | null>(null);
    const [balls, setBalls] = useState(initialBalls);
    const [turn, setTurn] = useState<'You' | 'Opponent'>('You');
    const [playerTarget, setPlayerTarget] = useState<'solid' | 'stripe' | null>(null);
    const [gameOver, setGameOver] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpponent({ name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival' });
            setStatus('Your turn to break!');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    
    // AI Logic
    useEffect(() => {
        if(turn === 'Opponent' && !gameOver) {
            const aiMoveTimeout = setTimeout(() => {
                 // Simple AI: pots a random stripe ball
                 const opponentTarget = playerTarget === 'solid' ? 'stripe' : 'solid';
                 const targetBalls = balls.filter(b => b.type === opponentTarget && !b.potted);
                 if (targetBalls.length > 0) {
                     const ballToPot = targetBalls[0];
                     setBalls(prev => prev.map(b => b.id === ballToPot.id ? {...b, potted: true} : b));
                     setStatus("Opponent potted a ball! Their turn again.");
                 } else {
                     // Try to pot 8 ball if all stripes are gone
                     const eightBall = balls.find(b => b.type === 'eight');
                     if(eightBall && !eightBall.potted) {
                        setBalls(prev => prev.map(b => b.id === 8 ? {...b, potted: true} : b));
                        setGameOver('Opponent Wins!');
                     } else {
                        setTurn('You');
                        setStatus('Your turn!');
                     }
                 }
            }, 2500);
            return () => clearTimeout(aiMoveTimeout);
        }
    }, [turn, gameOver, balls, playerTarget]);

    const handlePlayerShot = () => {
        if(turn !== 'You' || gameOver) return;
        setStatus('Thinking...');
        
        // Simplified Logic: Pot a player's solid ball
        if(!playerTarget) setPlayerTarget('solid');
        const targetBalls = balls.filter(b => b.type === 'solid' && !b.potted);
        
        if (targetBalls.length > 0) {
            const ballToPot = targetBalls[0];
            setBalls(prev => prev.map(b => b.id === ballToPot.id ? {...b, potted: true} : b));
            setStatus("You potted a solid! Your turn again.");
        } else {
             // Try to pot 8 ball
             const eightBall = balls.find(b => b.type === 'eight');
             if(eightBall && !eightBall.potted) {
                setBalls(prev => prev.map(b => b.id === 8 ? {...b, potted: true} : b));
                setGameOver('You Win!');
             } else {
                setTurn('Opponent');
                setStatus("Opponent's turn!");
             }
        }
    };
    
    const opponentTarget = playerTarget === 'solid' ? 'stripes' : 'solids';
    const yourPotted = balls.filter(b => b.type === playerTarget && b.potted).length;
    const opponentPotted = balls.filter(b => b.type !== playerTarget && b.type !== 'eight' && b.type !== 'cue' && b.potted).length;

  return (
    <div className="flex flex-col h-screen bg-green-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-green-700">
        <Link href="/games/pool" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">8 Ball Pool</h1>
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
             <div className="w-full max-w-md flex justify-between items-center mb-2">
                 <div className="flex items-center gap-2"><Avatar className="w-10 h-10"><AvatarImage src="https://i.pravatar.cc/150?u=you"/></Avatar><span>You ({playerTarget || '?'})</span></div>
                 <div className="flex gap-1">
                    {balls.filter(b => b.type === 'solid' && b.potted).map(b => <div key={b.id} className={cn("w-4 h-4 rounded-full", b.color)}></div>)}
                 </div>
                 <div className="flex gap-1">
                    {balls.filter(b => b.type === 'stripe' && b.potted).map(b => <div key={b.id} className={cn("w-4 h-4 rounded-full", b.color)}></div>)}
                 </div>
                 <div className="flex items-center gap-2"><span>{opponent.name} ({opponentTarget})</span><Avatar className="w-10 h-10"><AvatarImage src={opponent.avatar}/></Avatar></div>
             </div>
            <div className="w-full max-w-lg aspect-video bg-green-700 rounded-lg border-8 border-yellow-800 shadow-2xl relative p-8 cursor-pointer" onClick={handlePlayerShot}>
                {/* Pockets */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black rounded-full"></div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-black rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-black rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 bg-black rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 bg-black rounded-full"></div>
                
                {/* Balls */}
                {balls.filter(b => !b.potted).map(ball => (
                    <div key={ball.id} className={cn("absolute w-6 h-6 rounded-full shadow-md", ball.color)} style={{top: `${ball.y}%`, left: `${ball.x}%`, transform: 'translate(-50%, -50%)'}}>
                        {ball.type === 'stripe' && <div className="w-full h-2.5 bg-white mt-1.5"></div>}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent"></div>
                    </div>
                ))}
            </div>
             {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <h2 className="text-4xl font-bold text-white mt-4">{gameOver}</h2>
                    <Link href="/games/pool" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}
             <p className="mt-4 animate-pulse">{status}</p>
        </main>
      )}

    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Target, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const GRID_SIZE = 8;
type CellState = 'empty' | 'ship' | 'hit' | 'miss';
type Grid = CellState[];

const placeShipsRandomly = (): Grid => {
    const grid: Grid = Array(GRID_SIZE * GRID_SIZE).fill('empty');
    const shipLengths = [5, 4, 3, 3, 2];
    shipLengths.forEach(len => {
        let placed = false;
        while (!placed) {
            const isHorizontal = Math.random() > 0.5;
            const startX = Math.floor(Math.random() * (isHorizontal ? GRID_SIZE - len + 1 : GRID_SIZE));
            const startY = Math.floor(Math.random() * (isHorizontal ? GRID_SIZE : GRID_SIZE - len + 1));
            
            let canPlace = true;
            for(let i=0; i<len; i++) {
                const index = isHorizontal ? startY * GRID_SIZE + startX + i : (startY + i) * GRID_SIZE + startX;
                if(grid[index] !== 'empty') {
                    canPlace = false;
                    break;
                }
            }
            
            if(canPlace) {
                for(let i=0; i<len; i++) {
                    const index = isHorizontal ? startY * GRID_SIZE + startX + i : (startY + i) * GRID_SIZE + startX;
                    grid[index] = 'ship';
                }
                placed = true;
            }
        }
    });
    return grid;
};

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponent...');
    const [opponent, setOpponent] = useState<{name: string, avatar: string} | null>(null);
    const [playerGrid, setPlayerGrid] = useState<Grid>([]);
    const [opponentGrid, setOpponentGrid] = useState<Grid>([]); // AI ships
    const [turn, setTurn] = useState<'player' | 'opponent'>('player');
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpponent({ name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival' });
            setPlayerGrid(placeShipsRandomly());
            setOpponentGrid(placeShipsRandomly());
            setStatus('Your turn to fire!');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    
    // AI Turn Logic
    useEffect(() => {
        if(turn === 'opponent' && !winner) {
            const aiTurnTimeout = setTimeout(() => {
                let shotFired = false;
                while(!shotFired) {
                    const targetIndex = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
                    const newPlayerGrid = [...playerGrid];
                    if (newPlayerGrid[targetIndex] !== 'hit' && newPlayerGrid[targetIndex] !== 'miss') {
                         if (newPlayerGrid[targetIndex] === 'ship') {
                            newPlayerGrid[targetIndex] = 'hit';
                             setStatus('Opponent hit your ship!');
                         } else {
                            newPlayerGrid[targetIndex] = 'miss';
                             setStatus('Opponent missed! Your turn.');
                         }
                         setPlayerGrid(newPlayerGrid);
                         shotFired = true;
                         setTurn('player');
                    }
                }
            }, 2000);
            return () => clearTimeout(aiTurnTimeout);
        }
    }, [turn, winner, playerGrid]);
    
    // Check for winner
    useEffect(() => {
        if(opponentGrid.length > 0 && opponentGrid.filter(c => c === 'ship').length === 0) {
            setWinner('You');
        }
        if(playerGrid.length > 0 && playerGrid.filter(c => c === 'ship').length === 0) {
            setWinner('Opponent');
        }
    }, [playerGrid, opponentGrid]);

    const handlePlayerFire = (index: number) => {
        if (turn !== 'player' || winner) return;
        const newOpponentGrid = [...opponentGrid];
        if (newOpponentGrid[index] === 'hit' || newOpponentGrid[index] === 'miss') return; // already shot here

        if (newOpponentGrid[index] === 'ship') {
            newOpponentGrid[index] = 'hit';
            setStatus('You hit a ship! Fire again.');
        } else {
            newOpponentGrid[index] = 'miss';
            setStatus('You missed. Opponent\'s turn.');
            setTurn('opponent');
        }
        setOpponentGrid(newOpponentGrid);
    };

    const renderGrid = (grid: Grid, isPlayer: boolean) => (
        <div className="w-full max-w-md aspect-square bg-blue-500/70 border-4 border-blue-400 rounded-lg p-1 grid grid-cols-8 grid-rows-8 gap-1">
            {grid.map((cell, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "flex items-center justify-center rounded-sm",
                        cell === 'empty' && 'bg-blue-400/50',
                        cell === 'ship' && isPlayer && 'bg-gray-600',
                        cell === 'ship' && !isPlayer && 'bg-blue-400/50', // Hide opponent ships
                        cell === 'hit' && 'bg-red-500',
                        cell === 'miss' && 'bg-white/50',
                        turn === 'player' && !isPlayer && cell !== 'hit' && cell !== 'miss' && 'cursor-pointer hover:bg-yellow-400/50'
                    )}
                    onClick={() => !isPlayer && handlePlayerFire(i)}
                >
                    {cell === 'hit' && <span className="text-2xl">🔥</span>}
                    {cell === 'miss' && <span className="text-xl opacity-80">●</span>}
                </div>
            ))}
        </div>
    );

  return (
    <div className="flex flex-col h-screen bg-blue-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-blue-700">
        <Link href="/games/ship_wars" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Ship Wars</h1>
        <div className="w-10"></div>
      </header>

      {!opponent ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                     <div className="flex justify-center items-center space-x-8">
                        <Avatar className="w-24 h-24 border-4 border-blue-500"><AvatarImage src="https://i.pravatar.cc/150?u=you" /><AvatarFallback>YOU</AvatarFallback></Avatar>
                        <span className="text-4xl font-bold text-primary animate-pulse">VS</span>
                        <div className="w-24 h-24 border-4 border-dashed border-red-500 rounded-full flex items-center justify-center"><Timer className="w-12 h-12 text-red-500 animate-spin" /></div>
                    </div>
                    <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-around p-2 bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-vector/ocean-surface-background_1308-72622.jpg')"}}>
             <div className="flex flex-col items-center w-full">
                <h2 className="text-lg font-semibold">{opponent.name}'s Fleet</h2>
                {renderGrid(opponentGrid, false)}
             </div>
             
             {winner && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <h2 className="text-4xl font-bold text-white mt-4">{winner} Wins!</h2>
                    <Link href="/games/ship_wars" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

             <p className="my-2 animate-pulse text-xl font-bold drop-shadow-lg text-center">{status}</p>

             <div className="flex flex-col items-center w-full">
                <h2 className="text-lg font-semibold">Your Fleet</h2>
                {renderGrid(playerGrid, true)}
             </div>
        </main>
      )}

    </div>
  );
}

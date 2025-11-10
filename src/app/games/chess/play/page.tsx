'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChessPiece = ({ piece, color }: { piece: string, color: 'white' | 'black'}) => {
    const pieceMap: {[key: string]: string} = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
    };
    const key = color === 'white' ? piece.toUpperCase() : piece.toLowerCase();
    return <span className="text-4xl">{pieceMap[key]}</span>
}

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponent...');
    const [opponent, setOpponent] = useState<{name: string, avatar: string} | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpponent({ name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival' });
            setStatus('Match Starting!');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const initialBoard = [
        'r','n','b','q','k','b','n','r',
        'p','p','p','p','p','p','p','p',
        '','','','','','','','',
        '','','','','','','','',
        '','','','','','','','',
        '','','','','','','','',
        'P','P','P','P','P','P','P','P',
        'R','N','B','Q','K','B','N','R',
    ];

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/chess" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Chess</h1>
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
                 <div className="flex items-center gap-2"><Avatar className="w-10 h-10"><AvatarImage src={opponent.avatar}/></Avatar><span>{opponent.name}</span></div>
                 <span className="font-mono text-xl">04:32</span>
             </div>
             <div className="w-full max-w-md aspect-square bg-gray-500 rounded-lg grid grid-cols-8 grid-rows-8">
                 {initialBoard.map((piece, i) => (
                    <div key={i} className={`flex items-center justify-center ${(Math.floor(i/8) + i%8) % 2 === 0 ? 'bg-gray-200' : 'bg-green-700'}`}>
                        {piece && <ChessPiece piece={piece} color={piece === piece.toUpperCase() ? 'white' : 'black'} />}
                    </div>
                 ))}
             </div>
             <div className="w-full max-w-md flex justify-between items-center mt-2">
                 <div className="flex items-center gap-2"><Avatar className="w-10 h-10"><AvatarImage src="https://i.pravatar.cc/150?u=you"/></Avatar><span>You</span></div>
                 <span className="font-mono text-xl">04:55</span>
             </div>
             <p className="mt-4 animate-pulse">White's turn to move</p>
        </main>
      )}

    </div>
  );
}

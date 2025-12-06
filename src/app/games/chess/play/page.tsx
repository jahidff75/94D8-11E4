'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Timer, Flag, User, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// --- Components ---
const ChessPiece = ({ piece, color }: { piece: string, color: 'white' | 'black'}) => {
    const pieceMap: {[key: string]: string} = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
    };
    const key = piece.toUpperCase();
    const finalPiece = color === 'white' ? pieceMap[key] : pieceMap[key.toLowerCase()];
    return <span className="text-4xl cursor-pointer">{finalPiece}</span>
}

const Square = ({ piece, color, isLight, onClick }: { piece: string, color: 'white' | 'black' | '', isLight: boolean, onClick: () => void }) => {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center justify-center ${isLight ? 'bg-gray-200' : 'bg-green-700'}`}
        >
            {piece && <ChessPiece piece={piece} color={color as 'white' | 'black'} />}
        </div>
    )
}

// --- Game Logic ---
const initialBoardState = [
    'r','n','b','q','k','b','n','r',
    'p','p','p','p','p','p','p','p',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    'P','P','P','P','P','P','P','P',
    'R','N','B','Q','K','B','N','R',
];

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponent...');
    const [opponent, setOpponent] = useState<{name: string, avatar: string} | null>(null);
    const [board, setBoard] = useState(initialBoardState);
    const [turn, setTurn] = useState<'white' | 'black'>('white');
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpponent({ name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival' });
            setStatus("White's turn to move");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);
    
    // AI move logic
    useEffect(() => {
        if(turn === 'black' && !gameOver) {
            const aiMoveTimeout = setTimeout(() => {
                // Simplified AI: finds a random black piece and moves it one step forward if possible
                const blackPieces = board.map((p, i) => (p.toLowerCase() === p && p !== '') ? i : -1).filter(i => i !== -1);
                let moved = false;
                while(!moved && blackPieces.length > 0) {
                    const randIndex = Math.floor(Math.random() * blackPieces.length);
                    const pieceIndex = blackPieces[randIndex];
                    const piece = board[pieceIndex];
                    
                    let targetIndex = -1;
                    if(piece === 'p') {
                        targetIndex = pieceIndex + 8;
                    }
                    
                    if(targetIndex !== -1 && targetIndex < 64 && board[targetIndex] === '') {
                        const newBoard = [...board];
                        newBoard[targetIndex] = newBoard[pieceIndex];
                        newBoard[pieceIndex] = '';
                        setBoard(newBoard);
                        setTurn('white');
                        setStatus("White's turn to move");
                        moved = true;
                    }
                    blackPieces.splice(randIndex, 1); // try another piece
                }
            }, 2000);
            return () => clearTimeout(aiMoveTimeout);
        }
    }, [turn, board, gameOver]);

    const handleSquareClick = (index: number) => {
        if (gameOver || turn !== 'white') return;

        if (selectedPiece === null) {
            if (board[index] && board[index] === board[index].toUpperCase()) { // It's a white piece
                setSelectedPiece(index);
            }
        } else {
            // Simplified move logic: any empty square is a valid move for demonstration
            if (board[index] === '') {
                const newBoard = [...board];
                newBoard[index] = newBoard[selectedPiece];
                newBoard[selectedPiece] = '';
                setBoard(newBoard);
                setTurn('black');
                setStatus("Black's turn to move");
            } else if (board[index] && board[index].toLowerCase() === board[index]) { // Capture black piece
                 const newBoard = [...board];
                 if(board[index] === 'k') setGameOver('White Wins!');
                 newBoard[index] = newBoard[selectedPiece];
                 newBoard[selectedPiece] = '';
                 setBoard(newBoard);
                 setTurn('black');
                 setStatus("Black's turn to move");
            }
            setSelectedPiece(null);
        }
    };

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
             <div className="w-full max-w-md aspect-square bg-gray-500 rounded-lg grid grid-cols-8 grid-rows-8 shadow-2xl">
                 {board.map((piece, i) => (
                    <Square
                        key={i}
                        piece={piece}
                        color={piece ? (piece === piece.toUpperCase() ? 'white' : 'black') : ''}
                        isLight={(Math.floor(i/8) + i%8) % 2 === 0}
                        onClick={() => handleSquareClick(i)}
                    />
                 ))}
             </div>
             {gameOver && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <Flag className="w-24 h-24 text-yellow-400" />
                    <h2 className="text-4xl font-bold text-white mt-4">{gameOver}</h2>
                    <Link href="/games/chess" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}
             <div className="w-full max-w-md flex justify-between items-center mt-2">
                 <div className="flex items-center gap-2"><Avatar className="w-10 h-10"><AvatarImage src="https://i.pravatar.cc/150?u=you"/></Avatar><span>You</span></div>
                 <span className="font-mono text-xl">04:55</span>
             </div>
             <p className={cn("mt-4 animate-pulse", turn === 'black' && 'text-gray-400')}>{status}</p>
        </main>
      )}

    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Crown, Dices, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Helper Components ---

// Player Info Component
const PlayerInfo = ({ name, avatarUrl, isTurn, color }: { name: string; avatarUrl: string; isTurn: boolean; color: string }) => (
  <div className={cn("relative flex items-center gap-2 p-2 rounded-lg bg-card/80 border-2", isTurn ? "border-green-400 shadow-lg shadow-green-400/20" : "border-transparent")}>
    <Avatar className={cn("h-10 w-10 border-4", isTurn ? 'border-green-400' : 'border-gray-500')}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback style={{ backgroundColor: color, color: 'white' }}>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div>
      <span className="font-semibold text-sm text-white">{name}</span>
    </div>
  </div>
);

// Game Piece Component
const GamePiece = ({ color, className }: { color: string, className?: string }) => (
  <div className={cn("w-6 h-6 rounded-full shadow-lg transition-all duration-500", className)} style={{ backgroundColor: color, border: '2px solid white' }}></div>
);

// Dice Component
const Dice = ({ value, isRolling }: { value: number, isRolling: boolean }) => (
  <div className={cn("w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-black shadow-lg transition-transform duration-300", isRolling && "animate-spin")}>
    {value}
  </div>
);

// --- Main Game Logic & State ---

const boardSize = 10;
const totalSquares = boardSize * boardSize;

// Define snakes and ladders: { start: end }
const snakes: { [key: number]: number } = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78,
};
const ladders: { [key: number]: number } = {
  4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91,
};

const initialPlayers = [
    { id: 0, name: 'You', color: '#1e88e5', avatar: 'https://i.pravatar.cc/150?u=you', position: 1 },
    { id: 1, name: 'Riya', color: '#e53935', avatar: 'https://i.pravatar.cc/150?u=riya', position: 1 },
    { id: 2, name: 'Mithun', color: '#43a047', avatar: 'https://i.pravatar.cc/150?u=mithun', position: 1 },
    { id: 3, name: 'Pooja', color: '#fdd835', avatar: 'https://i.pravatar.cc/150?u=pooja', position: 1 },
];


export default function SnakeAndLadderGamePage() {
  const [players, setPlayers] = useState(initialPlayers);
  const [currentTurn, setCurrentTurn] = useState(0); // Player index
  const [diceValue, setDiceValue] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<typeof initialPlayers[0] | null>(null);
  const [gameMessage, setGameMessage] = useState("Your turn to roll the dice!");

  // Handle dice roll
  const handleDiceRoll = () => {
    if (isRolling || winner || currentTurn !== 0) return;

    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
        setDiceValue(roll);
        setIsRolling(false);
        movePlayer(currentTurn, roll);
    }, 1000);
  };
  
  // Move player logic
  const movePlayer = (playerIndex: number, roll: number) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      const player = newPlayers[playerIndex];
      
      if (player.position + roll <= totalSquares) {
        let newPosition = player.position + roll;
        
        // Check for snakes or ladders
        setTimeout(() => {
            if (snakes[newPosition]) {
                setGameMessage(`${player.name} got bitten by a snake at ${newPosition}!`);
                newPosition = snakes[newPosition];
            } else if (ladders[newPosition]) {
                setGameMessage(`${player.name} climbed a ladder from ${newPosition}!`);
                newPosition = ladders[newPosition];
            }
            
            const updatedPlayers = prevPlayers.map(p => p.id === player.id ? {...p, position: newPosition} : p);
            setPlayers(updatedPlayers);

            // Check for winner
            if (newPosition === totalSquares) {
                setWinner(player);
                setGameMessage(`${player.name} has won the game!`);
                return;
            }

            // Change turn if roll is not 6
            if (roll !== 6) {
                const nextTurn = (playerIndex + 1) % players.length;
                setCurrentTurn(nextTurn);
                setGameMessage(nextTurn === 0 ? "Your turn!" : `${newPlayers[nextTurn].name}'s turn.`);
            } else {
                 setGameMessage(`${player.name} got a 6, roll again!`);
            }
        }, 700); // Delay to show snake/ladder effect
      } else {
          // If move is not possible, change turn
          const nextTurn = (playerIndex + 1) % players.length;
          setCurrentTurn(nextTurn);
          setGameMessage(nextTurn === 0 ? "Your turn!" : `${newPlayers[nextTurn].name}'s turn.`);
      }
      return newPlayers;
    });
  };

  // Bot logic
  useEffect(() => {
    if (winner) return;
    if (currentTurn !== 0) { // If it's a bot's turn
        const botTurnTimeout = setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            setDiceValue(roll);
            movePlayer(currentTurn, roll);
        }, 2500); // Bots take some time to "think"
        return () => clearTimeout(botTurnTimeout);
    }
  }, [currentTurn, winner]);

  // --- Rendering Functions ---

  const renderBoard = () => {
    const squares = [];
    for (let i = totalSquares; i >= 1; i--) {
        const row = Math.ceil(i / boardSize);
        let squareNumber = i;
        // Adjust for zigzag pattern
        if (row % 2 === 0) {
            const startOfRow = (row - 1) * boardSize + 1;
            const endOfRow = row * boardSize;
            squareNumber = startOfRow + (endOfRow - i);
        }

        const isEven = (Math.floor((squareNumber - 1) / 10) + (squareNumber - 1) % 10) % 2 === 0;
        
        // Find players on this square
        const playersOnSquare = players.filter(p => p.position === squareNumber);

        squares.push(
            <div key={i} className={cn("relative flex items-center justify-center border border-black/20", isEven ? 'bg-amber-100' : 'bg-emerald-100')}>
                <span className="absolute top-0 left-1 text-xs font-bold text-black/40">{squareNumber}</span>
                <div className="flex flex-wrap gap-1 p-1">
                    {playersOnSquare.map(p => <GamePiece key={p.id} color={p.color} />)}
                </div>
                 {snakes[squareNumber] && (
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M50 0 C 80 20, 20 80, 50 100" stroke="#E53935" strokeWidth="5" fill="none" strokeLinecap="round"/>
                    </svg>
                )}
                {ladders[squareNumber] && (
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M20 90 L 80 10" stroke="#4CAF50" strokeWidth="5" fill="none" strokeLinecap="round"/>
                    </svg>
                )}
            </div>
        );
    }
    return squares;
  };
  
  return (
    <div className="flex flex-col h-screen bg-cover bg-center" style={{backgroundImage: "url('https://i.ibb.co/3k5g72f/ludo-bg.jpg')"}}>
        <header className="flex items-center justify-between p-2">
            <Link href="/games/snl" passHref>
            <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><ArrowLeft /></Button>
            </Link>
            <h1 className="text-xl font-bold text-white bg-black/50 px-3 py-1 rounded-lg">Snake & Ladder</h1>
             <div className="w-10"></div>
        </header>

        <main className="flex-1 flex flex-col justify-between p-2 space-y-2">
            {/* Top Players */}
            <div className="grid grid-cols-2 gap-2">
                <PlayerInfo name={players[1].name} avatarUrl={players[1].avatar} isTurn={currentTurn === 1} color={players[1].color} />
                <PlayerInfo name={players[2].name} avatarUrl={players[2].avatar} isTurn={currentTurn === 2} color={players[2].color} />
            </div>

            {/* Game Board */}
            <div className="relative w-full max-w-md mx-auto aspect-square p-2 bg-amber-300 border-4 border-amber-600 rounded-xl shadow-2xl">
                 <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                    {renderBoard()}
                 </div>
                 {winner && (
                     <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                        <Crown className="w-24 h-24 text-yellow-400" />
                        <h2 className="text-3xl font-bold text-white mt-4">{winner.name} Wins!</h2>
                        <Link href="/games/snl" passHref>
                            <Button className="mt-6">Play Again</Button>
                        </Link>
                     </div>
                 )}
            </div>

             {/* Bottom Players & Controls */}
            <div className="grid grid-cols-2 gap-2">
                <PlayerInfo name={players[3].name} avatarUrl={players[3].avatar} isTurn={currentTurn === 3} color={players[3].color} />
                <PlayerInfo name={players[0].name} avatarUrl={players[0].avatar} isTurn={currentTurn === 0} color={players[0].color} />
            </div>

            <div className="flex items-center justify-around p-2 bg-black/30 rounded-xl">
                <div className="flex flex-col items-center gap-1">
                     <Dice value={diceValue} isRolling={isRolling}/>
                     <p className="text-white text-sm font-semibold h-5">{gameMessage}</p>
                </div>
                 <Button onClick={handleDiceRoll} disabled={isRolling || currentTurn !== 0 || !!winner} className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold text-xl px-8 py-8 rounded-2xl shadow-lg border-2 border-white disabled:opacity-50 disabled:animate-none">
                    <Dices className="w-8 h-8 mr-2"/>
                    ROLL
                </Button>
            </div>
        </main>
    </div>
  );
}

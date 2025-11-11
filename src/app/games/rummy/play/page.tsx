'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Settings, User, Spade, Heart, Diamond, Club, Coins, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Helper Components ---
const Card = ({ suit, rank, isJoker }: { suit: 'spades' | 'hearts' | 'diamonds' | 'clubs'; rank: string, isJoker?: boolean }) => {
    const suitIcon = {
        spades: <Spade className="w-4 h-4 fill-current" />,
        hearts: <Heart className="w-4 h-4 fill-current" />,
        diamonds: <Diamond className="w-4 h-4 fill-current" />,
        clubs: <Club className="w-4 h-4 fill-current" />,
    }[suit];
    const color = (suit === 'hearts' || suit === 'diamonds') ? 'text-red-600' : 'text-black';

    return (
        <div className={cn("relative w-16 h-24 bg-white rounded-lg shadow-md flex flex-col justify-between p-1 border-2", isJoker ? "border-yellow-400" : "border-gray-200")}>
            <div className={cn("font-bold text-xl", color)}>
                <span>{rank}</span>
                <div className={cn("w-4 h-4", color)}>{suitIcon}</div>
            </div>
            <div className={cn("self-end font-bold text-xl transform rotate-180", color)}>
                <span>{rank}</span>
                <div className={cn("w-4 h-4", color)}>{suitIcon}</div>
            </div>
            {isJoker && <div className="absolute inset-0 bg-yellow-400/20 rounded-md"></div>}
        </div>
    );
};

const PlayerInfo = ({ name, avatarUrl, isTurn, cardCount }: { name: string; avatarUrl: string; isTurn: boolean; cardCount: number }) => (
  <div className={cn("relative flex flex-col items-center gap-1 p-2 rounded-lg bg-black/50 w-24", isTurn && "border-2 border-yellow-400")}>
    <Avatar className={cn("h-12 w-12 border-4", isTurn ? 'border-yellow-400' : 'border-gray-600')}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className='text-white text-center'>
      <span className="font-bold text-sm truncate">{name}</span>
      <p className="text-xs">{cardCount} Cards</p>
    </div>
    {isTurn && <Timer className="w-5 h-5 text-yellow-400 absolute -top-2 animate-spin"/>}
  </div>
);

// --- Main Game Logic & State ---
const initialDeck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits: ('spades' | 'hearts' | 'diamonds' | 'clubs')[] = ['spades', 'hearts', 'diamonds', 'clubs'];

export default function RummyGamePage() {
    const [status, setStatus] = useState('Waiting for players...');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [myCards, setMyCards] = useState<{suit: any, rank: string}[]>([]);
    
    const players = [
        { id: 1, name: 'Rohan', avatar: 'https://i.pravatar.cc/150?u=rohan', cardCount: 13 },
        { id: 2, name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=priya', cardCount: 13 },
        { id: 3, name: 'Amit', avatar: 'https://i.pravatar.cc/150?u=amit', cardCount: 13 },
        { id: 4, name: 'Sana', avatar: 'https://i.pravatar.cc/150?u=sana', cardCount: 13 },
        { id: 0, name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', cardCount: 13 },
    ];
    const [currentTurn, setCurrentTurn] = useState(''); // Player name

    useEffect(() => {
        setTimeout(() => {
            setIsGameStarted(true);
            setStatus("Rohan's Turn");
            setCurrentTurn('Rohan');
            // Deal cards
            const dealtCards = [];
            for (let i = 0; i < 13; i++) {
                dealtCards.push({ suit: suits[Math.floor(Math.random()*4)], rank: initialDeck[Math.floor(Math.random()*13)]})
            }
            setMyCards(dealtCards);

        }, 3000);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-cover bg-center bg-green-900" style={{backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/poker-green.png')"}}>
            <header className="flex items-center justify-between p-2">
                <Link href="/games/rummy" passHref>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><ArrowLeft /></Button>
                </Link>
                <div className="text-center text-white">
                    <p className="text-sm">Prize Pool</p>
                    <p className="font-bold text-lg text-yellow-400 flex items-center gap-1"><Coins className="w-5 h-5"/> 700</p>
                </div>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><Settings /></Button>
            </header>

            {!isGameStarted ? (
                 <div className="flex flex-col items-center justify-center flex-1 gap-4 text-white">
                    <h2 className="text-2xl font-bold mt-20 bg-black/50 px-4 py-2 rounded-lg">{status}</h2>
                    <div className="flex space-x-4 mt-4">
                        {players.map(p => <Avatar key={p.id} className="w-16 h-16 border-4 border-gray-500"><AvatarImage src={p.avatar}/><AvatarFallback>{p.name.charAt(0)}</AvatarFallback></Avatar>)}
                    </div>
                 </div>
            ) : (
                <main className="flex-1 flex flex-col p-1 space-y-1 justify-between overflow-hidden">
                    <div className="flex justify-around items-center">
                         {players.filter(p => p.id !== 0 && p.id < 4).map(p => (
                             <PlayerInfo key={p.id} name={p.name} avatarUrl={p.avatar} isTurn={currentTurn === p.name} cardCount={p.cardCount} />
                         ))}
                    </div>
                    
                    <div className="flex justify-between items-center h-full">
                        <PlayerInfo name={players[3].name} avatarUrl={players[3].avatar} isTurn={currentTurn === players[3].name} cardCount={players[3].cardCount} />
                        <div className="flex-1 h-full flex items-center justify-center gap-4">
                            {/* Deck and Discard Pile */}
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-24 bg-blue-800 rounded-lg shadow-lg border-2 border-blue-900 flex items-center justify-center text-white font-bold [transform:style_preserve-3d] [transform:rotateY_180deg]">
                                    <div className="w-14 h-20 rounded-md border-2 border-white/50 flex items-center justify-center text-xs">SCA</div>
                                </div>
                                <p className="text-white text-xs mt-1">Deck</p>
                            </div>
                            <div className="flex flex-col items-center">
                               <Card suit="hearts" rank="7" />
                               <p className="text-white text-xs mt-1">Discard</p>
                            </div>
                        </div>
                        <PlayerInfo name={players[0].name} avatarUrl={players[0].avatar} isTurn={currentTurn === players[0].name} cardCount={players[0].cardCount} />
                    </div>

                    <div className="bg-black/30 p-2 rounded-t-xl">
                        <div className="flex items-center justify-center space-x-[-2rem] pb-2">
                            {myCards.map((card, i) => <Card key={i} suit={card.suit} rank={card.rank} />)}
                        </div>
                        <div className="flex items-center justify-around">
                            <Button className="bg-red-600 hover:bg-red-700">Drop</Button>
                            <Button className="bg-yellow-500 hover:bg-yellow-600">Sort</Button>
                            <Button className="bg-green-600 hover:bg-green-700">Declare</Button>
                        </div>
                    </div>

                </main>
            )}
        </div>
    );
}

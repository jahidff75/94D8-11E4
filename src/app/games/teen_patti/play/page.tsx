'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Settings, Coins, Minus, Plus, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Helper Components ---
const PlayingCard = ({ back, rank, suit, isJoker }: { back?: boolean; rank?: string; suit?: '♠' | '♥' | '♦' | '♣'; isJoker?: boolean}) => (
    <div className={cn("w-14 h-20 rounded-lg shadow-md border-2", 
        back ? "bg-blue-800 border-blue-900" : "bg-white border-gray-200",
        isJoker && !back && "ring-2 ring-yellow-400"
    )}>
      {back ? (
         <div className="w-full h-full flex items-center justify-center text-white font-bold [transform:style_preserve-3d] [transform:rotateY_180deg]">
            <div className="w-12 h-[70px] rounded-md border-2 border-white/50 flex items-center justify-center text-xs">SCA</div>
        </div>
      ) : (
        <div className={cn("text-center font-bold text-lg p-1 flex flex-col justify-between h-full", suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-black')}>
            <div>{rank}</div>
            <div>{suit}</div>
        </div>
      )}
    </div>
);

type Player = {
    id: number;
    name: string;
    avatar: string;
    status: 'Playing' | 'Packed' | 'Winner';
    isBot: boolean;
    cards: {rank: string, suit: '♠' | '♥' | '♦' | '♣'}[];
};

const PlayerSpot = ({ player, isTurn }: { player: Player; isTurn: boolean; }) => (
    <div className="flex flex-col items-center gap-1 w-24">
        <Avatar className={cn("h-16 w-16 border-4", isTurn ? 'border-yellow-400' : 'border-gray-600')}>
            <AvatarImage src={player.avatar} />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold text-sm truncate">{player.name}</span>
        <span className={cn("text-xs px-2 py-0.5 rounded-full", player.status === 'Packed' ? 'bg-red-600' : player.status === 'Winner' ? 'bg-yellow-400 text-black' : 'bg-green-600')}>{player.status}</span>
    </div>
);

// --- Game Logic & State ---
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const createDeck = () => ranks.flatMap(r => suits.map(s => ({rank: r, suit: s})));

const dealCards = (deck: {rank: string, suit: '♠' | '♥' | '♦' | '♣'}[]) => {
    const hand = [];
    for(let i=0; i<3; i++) {
        const cardIndex = Math.floor(Math.random() * deck.length);
        hand.push(deck.splice(cardIndex, 1)[0]);
    }
    return hand;
}

export default function TeenPattiGamePage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [potAmount, setPotAmount] = useState(0);
    const [currentBet, setCurrentBet] = useState(100);
    const [showMyCards, setShowMyCards] = useState(false);
    
    const [players, setPlayers] = useState<Player[]>([]);
    const [turnIndex, setTurnIndex] = useState(0);
    const [message, setMessage] = useState('Game is starting...');

    useEffect(() => {
        // Initialize game
        const deck = createDeck();
        const initialPlayers: Player[] = [
            { id: 0, name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', status: 'Playing', isBot: false, cards: dealCards(deck) },
            { id: 1, name: 'Bot Rohan', avatar: 'https://i.pravatar.cc/150?u=rohan', status: 'Playing', isBot: true, cards: dealCards(deck) },
            { id: 2, name: 'Bot Priya', avatar: 'https://i.pravatar.cc/150?u=priya', status: 'Playing', isBot: true, cards: dealCards(deck) },
            { id: 3, name: 'Bot Amit', avatar: 'https://i.pravatar.cc/150?u=amit', status: 'Playing', isBot: true, cards: dealCards(deck) },
            { id: 4, name: 'Bot Sana', avatar: 'https://i.pravatar.cc/150?u=sana', status: 'Playing', isBot: true, cards: dealCards(deck) },
        ];
        setPlayers(initialPlayers);
        setPotAmount(500); // Initial pot
        setTimeout(() => {
            setIsGameStarted(true);
            setMessage("Your turn to bet.");
        }, 1500);
    }, []);
    
    const nextTurn = () => {
        setTurnIndex(prevIndex => {
            let nextIdx = (prevIndex + 1) % players.length;
            while(players[nextIdx].status !== 'Playing') {
                nextIdx = (nextIdx + 1) % players.length;
            }
            return nextIdx;
        });
    };
    
    useEffect(() => {
        if(!isGameStarted) return;
        const currentTurnPlayer = players[turnIndex];
        setMessage(`${currentTurnPlayer.name}'s turn`);

        if(currentTurnPlayer.isBot) {
            const botActionTimeout = setTimeout(() => {
                // Simple Bot Logic: 80% chance to play, 20% to pack
                if(Math.random() < 0.8) {
                    setPotAmount(p => p + currentBet);
                } else {
                    setPlayers(ps => ps.map(p => p.id === currentTurnPlayer.id ? {...p, status: 'Packed'} : p));
                }
                nextTurn();
            }, 2000);
            return () => clearTimeout(botActionTimeout);
        }
        
        // Check for winner
        const remainingPlayers = players.filter(p => p.status === 'Playing');
        if(remainingPlayers.length === 1) {
            setPlayers(ps => ps.map(p => p.id === remainingPlayers[0].id ? {...p, status: 'Winner'} : p));
            setMessage(`${remainingPlayers[0].name} wins the pot!`);
        }

    }, [turnIndex, isGameStarted]);

    const handleAction = (action: string) => {
        if (turnIndex !== 0) return; // Not your turn
        if (action === 'pack') {
            setPlayers(ps => ps.map(p => p.id === 0 ? {...p, status: 'Packed'} : p));
        }
        if(action === 'chaal') {
            setPotAmount(p => p + currentBet);
        }
        nextTurn();
    }

    const currentTurnPlayerName = players[turnIndex]?.name;

    return (
        <div className="flex flex-col h-screen bg-cover bg-center bg-green-900" style={{backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/poker-green.png')"}}>
            <header className="flex items-center justify-between p-2">
                <Link href="/games/teen_patti" passHref>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><ArrowLeft /></Button>
                </Link>
                <h1 className="text-white font-bold text-lg">{message}</h1>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><Settings /></Button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-between p-2 relative">
                {/* Opponent Players */}
                <div className="w-full flex justify-around">
                    {players.filter(p => p.id === 2 || p.id === 3).map(p => <PlayerSpot key={p.id} player={p} isTurn={currentTurnPlayerName === p.name} />)}
                </div>
                 <div className="w-full flex justify-between px-4">
                    {players.filter(p => p.id === 1).map(p => <PlayerSpot key={p.id} player={p} isTurn={currentTurnPlayerName === p.name} />)}
                    {players.filter(p => p.id === 4).map(p => <PlayerSpot key={p.id} player={p} isTurn={currentTurnPlayerName === p.name} />)}
                </div>

                {/* Center Table */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <p className="text-white font-semibold">Pot Amount</p>
                    <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full text-yellow-400 font-bold text-xl">
                        <Coins />
                        <span>{potAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Your Area */}
                <div className="w-full flex flex-col items-center">
                    <PlayerSpot player={players[0]} isTurn={currentTurnPlayerName === 'You'}/>
                    <div className="flex items-center gap-2 my-2">
                        {showMyCards ? players[0].cards.map((c, i) => <PlayingCard key={i} rank={c.rank} suit={c.suit}/>) : <>
                            <PlayingCard back />
                            <PlayingCard back />
                            <PlayingCard back />
                        </>}
                        <Button variant="ghost" size="icon" onClick={() => setShowMyCards(!showMyCards)}>
                            {showMyCards ? <EyeOff className="text-white"/> : <Eye className="text-white"/>}
                        </Button>
                    </div>

                    <div className="w-full max-w-md bg-black/40 p-2 rounded-lg flex items-center justify-between gap-2">
                        <Button onClick={() => handleAction('pack')} disabled={turnIndex !== 0} className="bg-red-700 hover:bg-red-800 flex-1">PACK</Button>
                        <div className="flex items-center gap-1">
                             <Button onClick={() => setCurrentBet(v => Math.max(100, v - 100))} size="icon" variant="secondary"><Minus/></Button>
                             <span className="font-bold text-white w-20 text-center">{currentBet}</span>
                             <Button onClick={() => setCurrentBet(v => v + 100)} size="icon" variant="secondary"><Plus/></Button>
                        </div>
                        <Button onClick={() => handleAction('chaal')} disabled={turnIndex !== 0} className="bg-green-700 hover:bg-green-800 flex-1">CHAAL</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

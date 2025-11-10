'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Settings, Coins, Minus, Plus, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Helper Components ---
const PlayingCard = ({ back, rank, suit }: { back?: boolean; rank?: string; suit?: string }) => (
    <div className={cn("w-14 h-20 rounded-lg shadow-md border-2", back ? "bg-blue-800 border-blue-900" : "bg-white border-gray-200")}>
      {back ? (
         <div className="w-full h-full flex items-center justify-center text-white font-bold [transform:style_preserve-3d] [transform:rotateY_180deg]">
            <div className="w-12 h-[70px] rounded-md border-2 border-white/50 flex items-center justify-center text-xs">DOX</div>
        </div>
      ) : (
        <div className="text-center text-black font-bold text-lg p-1">
            <p>{rank}</p>
            <p>{suit}</p>
        </div>
      )}
    </div>
);


const PlayerSpot = ({ player, isTurn, onAction }: { player: any; isTurn: boolean; onAction: (action: string) => void }) => (
    <div className="flex flex-col items-center gap-1">
        <Avatar className={cn("h-16 w-16 border-4", isTurn ? 'border-yellow-400' : 'border-gray-600')}>
            <AvatarImage src={player.avatar} />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold text-sm">{player.name}</span>
        <span className={cn("text-xs px-2 py-0.5 rounded-full", player.status === 'Packed' ? 'bg-red-600' : 'bg-green-600')}>{player.status}</span>
        <div className="flex gap-1">
            <PlayingCard back />
            <PlayingCard back />
            <PlayingCard back />
        </div>
    </div>
);

// --- Main Game Logic & State ---
export default function TeenPattiGamePage() {
    const [status, setStatus] = useState('Game is starting...');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [potAmount, setPotAmount] = useState(1000);
    const [currentBet, setCurrentBet] = useState(100);
    const [showMyCards, setShowMyCards] = useState(false);

    const initialPlayers = [
        { id: 1, name: 'Rohan', avatar: 'https://i.pravatar.cc/150?u=rohan', status: 'Playing' },
        { id: 2, name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=priya', status: 'Playing' },
        { id: 3, name: 'Amit', avatar: 'https://i.pravatar.cc/150?u=amit', status: 'Packed' },
        { id: 4, name: 'Sana', avatar: 'https://i.pravatar.cc/150?u=sana', status: 'Playing' },
        { id: 0, name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', status: 'Playing' },
    ];
    const [players, setPlayers] = useState(initialPlayers);
    const [currentTurn, setCurrentTurn] = useState('You'); // Player name

    const myCards = [{rank: 'A', suit: '♠'}, {rank: 'A', suit: '♥'}, {rank: 'K', suit: '♦'}]

    useEffect(() => {
        setTimeout(() => setIsGameStarted(true), 1500);
    }, []);

    const handleAction = (action: string) => {
        if(currentTurn !== 'You') return;
        // Logic to handle player actions
        console.log(action);
        // Move to next player
        const currentIndex = players.findIndex(p => p.name === currentTurn);
        let nextIndex = (currentIndex + 1) % players.length;
        while(players[nextIndex].status === 'Packed') {
            nextIndex = (nextIndex + 1) % players.length;
        }
        setCurrentTurn(players[nextIndex].name);
    }

    return (
        <div className="flex flex-col h-screen bg-cover bg-center bg-green-900" style={{backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/poker-green.png')"}}>
            <header className="flex items-center justify-between p-2">
                <Link href="/games/teen_patti" passHref>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><ArrowLeft /></Button>
                </Link>
                <h1 className="text-white font-bold text-lg">Teen Patti</h1>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><Settings /></Button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-between p-2 relative">
                {/* Opponent Players */}
                <div className="w-full flex justify-around">
                    {players.filter(p => p.id === 1 || p.id === 2).map(p => <PlayerSpot key={p.id} player={p} isTurn={currentTurn === p.name} onAction={() => {}}/>)}
                </div>
                 <div className="w-full flex justify-between">
                    {players.filter(p => p.id === 4).map(p => <PlayerSpot key={p.id} player={p} isTurn={currentTurn === p.name} onAction={() => {}}/>)}
                    {players.filter(p => p.id === 3).map(p => <PlayerSpot key={p.id} player={p} isTurn={currentTurn === p.name} onAction={() => {}}/>)}
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
                     <div className="flex flex-col items-center gap-1">
                        <Avatar className={cn("h-20 w-20 border-4", currentTurn === 'You' ? 'border-yellow-400' : 'border-gray-600')}>
                            <AvatarImage src={'https://i.pravatar.cc/150?u=you'} />
                            <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <span className="text-white font-semibold text-lg">You</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-600">Playing</span>
                    </div>
                    <div className="flex items-center gap-2 my-2">
                        {showMyCards ? myCards.map((c, i) => <PlayingCard key={i} rank={c.rank} suit={c.suit}/>) : <>
                            <PlayingCard back />
                            <PlayingCard back />
                            <PlayingCard back />
                        </>}
                        <Button variant="ghost" size="icon" onClick={() => setShowMyCards(!showMyCards)}>
                            {showMyCards ? <EyeOff className="text-white"/> : <Eye className="text-white"/>}
                        </Button>
                    </div>

                    <div className="w-full max-w-md bg-black/40 p-2 rounded-lg flex items-center justify-between gap-2">
                        <Button onClick={() => handleAction('pack')} className="bg-red-700 hover:bg-red-800 flex-1">PACK</Button>
                        <div className="flex items-center gap-1">
                             <Button onClick={() => setCurrentBet(v => Math.max(100, v - 100))} size="icon" variant="secondary"><Minus/></Button>
                             <span className="font-bold text-white w-20 text-center">{currentBet}</span>
                             <Button onClick={() => setCurrentBet(v => v + 100)} size="icon" variant="secondary"><Plus/></Button>
                        </div>
                        <Button onClick={() => handleAction('chaal')} className="bg-green-700 hover:bg-green-800 flex-1">CHAAL</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

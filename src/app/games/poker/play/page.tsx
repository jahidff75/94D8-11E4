'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Coins } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Card = { rank: string; suit: '♠' | '♥' | '♦' | '♣'; };
type Player = {
    id: number;
    name: string;
    avatar: string;
    chips: number;
    hand: Card[];
    isBot: boolean;
    hasActed: boolean;
    isFolded: boolean;
};

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const createDeck = () => ranks.flatMap(r => suits.map(s => ({rank: r, suit: s})));

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Table...');
    const [players, setPlayers] = useState<Player[]>([]);
    const [communityCards, setCommunityCards] = useState<Card[]>([]);
    const [pot, setPot] = useState(0);
    const [turn, setTurn] = useState(0); // player index
    const [bettingRound, setBettingRound] = useState<'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown'>('pre-flop');

    useEffect(() => {
        // Initial game setup
        const deck = createDeck();
        const initialPlayers: Player[] = [
            { id: 0, name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', chips: 10000, hand: [deck.pop()!, deck.pop()!], isBot: false, hasActed: false, isFolded: false },
            { id: 1, name: 'Bot 1', avatar: 'https://i.pravatar.cc/150?u=p1', chips: 10000, hand: [deck.pop()!, deck.pop()!], isBot: true, hasActed: false, isFolded: false },
            { id: 2, name: 'Bot 2', avatar: 'https://i.pravatar.cc/150?u=p2', chips: 10000, hand: [deck.pop()!, deck.pop()!], isBot: true, hasActed: false, isFolded: false },
            { id: 3, name: 'Bot 3', avatar: 'https://i.pravatar.cc/150?u=p3', chips: 10000, hand: [deck.pop()!, deck.pop()!], isBot: true, hasActed: false, isFolded: false },
        ];
        setPlayers(initialPlayers);
        setStatus('Your turn to act.');
    }, []);

    // Bot logic
    useEffect(() => {
        if(players.length === 0) return;
        const currentPlayer = players[turn];
        if (currentPlayer?.isBot && !currentPlayer.isFolded) {
            const botActionTimeout = setTimeout(() => {
                // Simple bot: 70% check/call, 20% bet/raise, 10% fold
                const actionRoll = Math.random();
                if(actionRoll < 0.7) handlePlayerAction('check');
                else if (actionRoll < 0.9) handlePlayerAction('bet', 100);
                else handlePlayerAction('fold');
            }, 2000);
            return () => clearTimeout(botActionTimeout);
        }
    }, [turn, players]);
    
    const nextTurn = () => {
        setTurn(t => (t + 1) % players.length);
    }

    const handlePlayerAction = (action: 'check' | 'bet' | 'fold', amount = 0) => {
        const currentPlayer = players[turn];
        if(!currentPlayer || currentPlayer.isFolded) {
            nextTurn();
            return;
        }

        if(action === 'fold') {
            setPlayers(ps => ps.map(p => p.id === currentPlayer.id ? {...p, isFolded: true} : p));
        }
        if(action === 'bet') {
            setPot(p => p + amount);
            setPlayers(ps => ps.map(p => p.id === currentPlayer.id ? {...p, chips: p.chips - amount} : p));
        }
        nextTurn();
    };

  return (
    <div className="flex flex-col h-screen bg-green-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-green-700">
        <Link href="/games/poker" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Poker</h1>
        <div className="w-10"></div>
      </header>

      {players.length === 0 ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Timer className="w-16 h-16 mx-auto animate-spin text-white" />
                    <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-around p-4 bg-cover" style={{backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/poker-green.png')"}}>
            <div className="flex justify-around w-full">
                {players.filter(p => p.id !== 0).map(player => (
                    <div key={player.id} className={cn("flex flex-col items-center p-2 rounded-lg", turn === player.id && "bg-yellow-500/20 ring-2 ring-yellow-500")}>
                        <Avatar className="w-16 h-16"><AvatarImage src={player.avatar} /></Avatar>
                        <span>{player.name}</span>
                        <span className="text-sm text-yellow-400">{player.chips}</span>
                        {player.isFolded && <span className="text-xs text-red-500">FOLDED</span>}
                    </div>
                ))}
            </div>

            <div className="w-full max-w-lg h-64 bg-green-800/80 rounded-full border-8 border-yellow-700 flex flex-col items-center justify-center">
                <p className="text-lg flex items-center gap-2"><Coins/> Pot: {pot} Coins</p>
                <div className="flex gap-2 mt-4">
                    {communityCards.map((card, i) => <div key={i} className="w-12 h-16 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">{card.rank}<span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : ''}>{card.suit}</span></div>)}
                    {Array(5 - communityCards.length).fill(0).map((_, i) => <div key={i} className="w-12 h-16 bg-gray-600/50 border-2 border-dashed rounded-lg"></div>)}
                </div>
            </div>
            
            <div className="w-full flex items-center justify-between">
                <div className={cn("flex flex-col items-center p-2 rounded-lg", turn === 0 && "bg-yellow-500/20 ring-2 ring-yellow-500")}>
                     <Avatar className="w-16 h-16"><AvatarImage src={players[0].avatar} /></Avatar>
                    <div className="flex gap-2 items-center">
                        <div className="w-14 h-20 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">{players[0]?.hand[0].rank}<span className={players[0]?.hand[0].suit === '♥' || players[0]?.hand[0].suit === '♦' ? 'text-red-600' : ''}>{players[0]?.hand[0].suit}</span></div>
                        <div className="w-14 h-20 bg-white border-2 rounded-lg text-black p-1 text-center font-bold">{players[0]?.hand[1].rank}<span className={players[0]?.hand[1].suit === '♥' || players[0]?.hand[1].suit === '♦' ? 'text-red-600' : ''}>{players[0]?.hand[1].suit}</span></div>
                    </div>
                    <span>You ({players[0].chips})</span>
                </div>
                 <div className="flex flex-col gap-2">
                    <Button onClick={() => handlePlayerAction('check')} disabled={turn !== 0}>Check</Button>
                    <Button onClick={() => handlePlayerAction('fold')} variant="destructive" disabled={turn !== 0}>Fold</Button>
                    <Button onClick={() => handlePlayerAction('bet', 200)} className="bg-green-600" disabled={turn !== 0}>Bet 200</Button>
                </div>
            </div>

        </main>
      )}

    </div>
  );
}

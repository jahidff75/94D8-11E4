'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Settings, User, Spade, Heart, Diamond, Club, Coins, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Helper Components ---
type CardData = { suit: 'spades' | 'hearts' | 'diamonds' | 'clubs'; rank: string, isJoker?: boolean };

const Card = ({ suit, rank, isJoker, isSelected }: { suit: 'spades' | 'hearts' | 'diamonds' | 'clubs'; rank: string, isJoker?: boolean, isSelected?: boolean }) => {
    const suitIcon = {
        spades: <Spade className="w-4 h-4 fill-current" />,
        hearts: <Heart className="w-4 h-4 fill-current" />,
        diamonds: <Diamond className="w-4 h-4 fill-current" />,
        clubs: <Club className="w-4 h-4 fill-current" />,
    }[suit];
    const color = (suit === 'hearts' || suit === 'diamonds') ? 'text-red-600' : 'text-black';

    return (
        <div className={cn("relative w-16 h-24 bg-white rounded-lg shadow-md flex flex-col justify-between p-1 border-2 cursor-pointer transition-transform", 
          isJoker ? "border-yellow-400" : "border-gray-200",
          isSelected ? "-translate-y-4" : ""
        )}>
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
const initialDeckRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const initialSuits: ('spades' | 'hearts' | 'diamonds' | 'clubs')[] = ['spades', 'hearts', 'diamonds', 'clubs'];

const createFullDeck = () => {
    const deck: CardData[] = [];
    initialSuits.forEach(suit => {
        initialDeckRanks.forEach(rank => {
            deck.push({ suit, rank });
        });
    });
    return deck;
}

export default function RummyGamePage() {
    const [status, setStatus] = useState('Waiting for players...');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [myCards, setMyCards] = useState<CardData[]>([]);
    const [players, setPlayers] = useState<{ id: number; name: string; avatar: string; cardCount: number; isBot: boolean }[]>([]);
    const [turnIndex, setTurnIndex] = useState(0);
    const [deck, setDeck] = useState<CardData[]>([]);
    const [discardPile, setDiscardPile] = useState<CardData[]>([]);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

    useEffect(() => {
        setTimeout(() => {
            // Setup game
            const fullDeck = createFullDeck();
            const shuffleDeck = () => fullDeck.sort(() => Math.random() - 0.5);

            const shuffledDeck = shuffleDeck();

            const initialPlayers = [
                { id: 0, name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', cardCount: 13, isBot: false },
                { id: 1, name: 'Bot Rohan', avatar: 'https://i.pravatar.cc/150?u=rohan', cardCount: 13, isBot: true },
                { id: 2, name: 'Bot Priya', avatar: 'https://i.pravatar.cc/150?u=priya', cardCount: 13, isBot: true },
            ];

            setMyCards(shuffledDeck.splice(0, 13));
            setDiscardPile([shuffledDeck.pop()!]);
            setDeck(shuffledDeck);
            setPlayers(initialPlayers);
            setIsGameStarted(true);
            setStatus("Your Turn");
            setTurnIndex(0);
        }, 3000);
    }, []);
    
    // Bot Logic
    useEffect(() => {
        if (!isGameStarted || turnIndex === 0) return;
        
        const botTurnTimeout = setTimeout(() => {
            // Bot draws a card from deck
            const newDeck = [...deck];
            newDeck.pop();
            setDeck(newDeck);
            
            // Bot discards a random card
            const newDiscard = { suit: initialSuits[0], rank: '2'}; // placeholder
            setDiscardPile(prev => [newDiscard, ...prev]);

            setTurnIndex(i => (i + 1) % players.length);
            setStatus("Your Turn");
        }, 2000);

        return () => clearTimeout(botTurnTimeout);
    }, [turnIndex, isGameStarted]);

    const handleDrawFromDeck = () => {
        if (turnIndex !== 0) return;
        const newDeck = [...deck];
        const drawnCard = newDeck.pop();
        if (drawnCard) {
            setMyCards(prev => [...prev, drawnCard]);
            setDeck(newDeck);
            setStatus("Discard a card");
        }
    };
    
    const handleDiscard = (cardIndex: number) => {
        if (turnIndex !== 0 || myCards.length <= 13) return;
        const newMyCards = [...myCards];
        const discardedCard = newMyCards.splice(cardIndex, 1)[0];
        setMyCards(newMyCards);
        setDiscardPile(prev => [discardedCard, ...prev]);
        setSelectedCardIndex(null);
        setTurnIndex(i => (i + 1) % players.length);
    }

    return (
        <div className="flex flex-col h-screen bg-cover bg-center bg-green-900" style={{backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/poker-green.png')"}}>
            <header className="flex items-center justify-between p-2">
                <Link href="/games/rummy" passHref>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><ArrowLeft /></Button>
                </Link>
                <div className="text-center text-white">
                    <p className="font-bold text-lg">{status}</p>
                </div>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><Settings /></Button>
            </header>

            {!isGameStarted ? (
                 <div className="flex flex-col items-center justify-center flex-1 gap-4 text-white">
                    <Timer className="w-16 h-16 animate-spin"/>
                    <h2 className="text-2xl font-bold mt-4 bg-black/50 px-4 py-2 rounded-lg">{status}</h2>
                 </div>
            ) : (
                <main className="flex-1 flex flex-col p-1 space-y-1 justify-between overflow-hidden">
                    <div className="flex justify-around items-center">
                         {players.filter(p => p.id !== 0).map(p => (
                             <PlayerInfo key={p.id} name={p.name} avatarUrl={p.avatar} isTurn={turnIndex === p.id} cardCount={p.cardCount} />
                         ))}
                    </div>
                    
                    <div className="flex justify-center items-center h-full gap-4">
                        <div className="flex flex-col items-center" onClick={handleDrawFromDeck}>
                            <div className="w-16 h-24 bg-blue-800 rounded-lg shadow-lg border-2 border-blue-900 flex items-center justify-center text-white font-bold [transform:style_preserve-3d] [transform:rotateY_180deg]">
                                <div className="w-14 h-20 rounded-md border-2 border-white/50 flex items-center justify-center text-xs">SCA</div>
                            </div>
                            <p className="text-white text-xs mt-1">Deck ({deck.length})</p>
                        </div>
                        <div className="flex flex-col items-center">
                           {discardPile[0] && <Card suit={discardPile[0].suit} rank={discardPile[0].rank} />}
                           <p className="text-white text-xs mt-1">Discard</p>
                        </div>
                    </div>

                    <div className="bg-black/30 p-2 rounded-t-xl">
                        <div className="flex items-center justify-center space-x-[-2rem] pb-2 min-h-[112px]">
                            {myCards.map((card, i) => 
                                <div key={i} onClick={() => myCards.length > 13 ? handleDiscard(i) : setSelectedCardIndex(i)}>
                                    <Card suit={card.suit} rank={card.rank} isSelected={selectedCardIndex === i} />
                                </div>
                            )}
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

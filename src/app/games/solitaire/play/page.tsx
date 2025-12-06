'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Heart, Spade, Diamond, Club, Repeat, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// --- Game Logic & Data ---
type Card = { suit: 'H' | 'S' | 'D' | 'C'; rank: string; isFaceDown: boolean };
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits: ('H' | 'S' | 'D' | 'C')[] = ['H', 'S', 'D', 'C'];
const createDeck = () => suits.flatMap(s => ranks.map(r => ({ suit: s, rank: r, isFaceDown: true })));

// --- Components ---
const PlayingCard = ({ rank, suit, isFaceDown }: Card) => {
    const color = suit === 'H' || suit === 'D' ? 'text-red-600' : 'text-black';
    const suitIcon = { 'H': <Heart className="w-3 h-3 fill-current"/>, 'S': <Spade className="w-3 h-3 fill-current"/>, 'D': <Diamond className="w-3 h-3 fill-current"/>, 'C': <Club className="w-3 h-3 fill-current"/> }[suit];

    if(isFaceDown) return <div className="w-20 h-28 bg-blue-800 rounded-lg border-2 border-blue-900 shadow-md"></div>;

    return (
        <div className="w-20 h-28 bg-white rounded-lg border-2 p-1 flex flex-col justify-between shadow-md">
            <div className={`font-bold text-lg ${color}`}>{rank}{suitIcon}</div>
            <div className={`font-bold text-lg self-end transform rotate-180 ${color}`}>{rank}{suitIcon}</div>
        </div>
    );
};

const FoundationPile = ({ suit, cards }: { suit: 'H' | 'S' | 'D' | 'C'; cards: Card[] }) => {
    const suitIcon = { 'H': <Heart/>, 'S': <Spade/>, 'D': <Diamond/>, 'C': <Club/> }[suit];
    const topCard = cards[cards.length - 1];
    return (
        <div className="w-20 h-28 bg-green-900/50 rounded-lg border-2 border-dashed border-white/50 flex items-center justify-center text-4xl text-white/30">
            {topCard ? <PlayingCard {...topCard} /> : suitIcon}
        </div>
    );
};

// --- Main Page Component ---
export default function GamePlayPage() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const [tableau, setTableau] = useState<Card[][]>([]);
    const [stock, setStock] = useState<Card[]>([]);
    const [waste, setWaste] = useState<Card[]>([]);
    const [foundations, setFoundations] = useState<{[key in 'H' | 'S' | 'D' | 'C']: Card[]}>({ H: [], S: [], D: [], C: [] });
    const [isWin, setIsWin] = useState(false);

    const setupGame = () => {
      let deck = createDeck().sort(() => Math.random() - 0.5);
      const newTableau: Card[][] = [];
      for (let i = 0; i < 7; i++) {
        const pile = deck.splice(0, i + 1);
        pile[pile.length - 1].isFaceDown = false; // Flip last card
        newTableau.push(pile);
      }
      setTableau(newTableau);
      setStock(deck);
      setWaste([]);
      setFoundations({ H: [], S: [], D: [], C: [] });
      setScore(0);
      setTime(0);
      setIsWin(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGameStarted(true);
            setupGame();
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      if(!isGameStarted || isWin) return;
      const timer = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }, [isGameStarted, isWin]);

    const handleDrawStock = () => {
        if (stock.length === 0) {
            // Reset stock from waste
            setStock([...waste].reverse().map(c => ({...c, isFaceDown: true})));
            setWaste([]);
        } else {
            const newStock = [...stock];
            const drawnCard = newStock.pop();
            if(drawnCard) {
                setWaste(w => [{...drawnCard, isFaceDown: false}, ...w]);
                setStock(newStock);
            }
        }
    };
    
    // Simplified game logic for win condition check
    useEffect(() => {
        const totalCardsInFoundations = Object.values(foundations).reduce((sum, pile) => sum + pile.length, 0);
        if (totalCardsInFoundations === 52) {
            setIsWin(true);
        }
    }, [foundations]);


  return (
    <div className="flex flex-col h-screen bg-green-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-green-700 bg-green-900/50 z-10">
        <Link href="/games/solitaire" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Solitaire</h1>
        <Button variant="ghost" size="icon" onClick={setupGame}><Repeat/></Button>
      </header>

      {!isGameStarted ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse">Game is starting...</h2>
                    <Timer className="w-16 h-16 mx-auto animate-spin" />
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 space-y-4 bg-green-700">
             <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-lg">
                <div>
                    <p className="text-sm text-gray-400">SCORE</p>
                    <p className="text-2xl font-bold text-yellow-400">{score}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">TIME</p>
                    <p className="text-2xl font-bold">{new Date(time * 1000).toISOString().substr(14, 5)}</p>
                </div>
             </div>

             <div className="w-full flex justify-between">
                <div className="flex gap-2">
                    <div onClick={handleDrawStock} className="cursor-pointer">
                        {stock.length > 0 ? <PlayingCard suit="S" rank="" isFaceDown /> : <div className="w-20 h-28 bg-green-900/50 rounded-lg border-2 border-dashed border-white/50 flex items-center justify-center text-2xl font-bold"><Repeat/></div>}
                    </div>
                    <div>
                        {waste.length > 0 ? <PlayingCard {...waste[0]} /> : <div className="w-20 h-28"></div>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <FoundationPile suit="H" cards={foundations.H}/>
                    <FoundationPile suit="S" cards={foundations.S}/>
                    <FoundationPile suit="D" cards={foundations.D}/>
                    <FoundationPile suit="C" cards={foundations.C}/>
                </div>
             </div>
            
            <div className="w-full flex justify-between flex-1">
                {tableau.map((pile, i) => (
                    <div key={i} className="relative h-full w-[12%]">
                         {pile.map((card, j) => (
                             <div key={j} className="absolute" style={{top: `${j * 25}px`}}>
                                <PlayingCard {...card} />
                             </div>
                         ))}
                    </div>
                ))}
            </div>

            {isWin && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <Star className="w-24 h-24 text-yellow-400 fill-yellow-400" />
                    <h2 className="text-4xl font-bold text-white mt-4">You Win!</h2>
                    <p className="text-xl text-white">Score: {score}</p>
                    <Button onClick={setupGame} className="mt-6">Play Again</Button>
                 </div>
            )}

        </main>
      )}
    </div>
  );
}

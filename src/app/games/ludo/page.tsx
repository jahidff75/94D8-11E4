
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Crown, Send, Dices, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Helper component for player info
const PlayerInfo = ({ name, color, isTurn, isWinner }: { name: string; color: string; isTurn: boolean; isWinner?: boolean }) => (
  <div className={cn("flex items-center gap-2 p-2 rounded-lg", isTurn && "bg-primary/20 ring-2 ring-primary")}>
    <Avatar className="h-8 w-8">
      <AvatarFallback style={{ backgroundColor: color, color: 'white' }}>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <span className="font-semibold text-sm">{name}</span>
    {isWinner && <Crown className="w-5 h-5 text-yellow-500" />}
  </div>
);

// Ludo Piece component
const LudoPiece = ({ color }: { color: string }) => (
  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
     <User className="w-4 h-4 text-white/80" />
  </div>
);

// Main Ludo Game Page Component
export default function LudoGamePage() {
  const [status, setStatus] = useState('Waiting for players... 2/4');
  const [playersJoined, setPlayersJoined] = useState(2);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [diceNumber, setDiceNumber] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState(''); // Player name
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const players = [
    { name: 'You', color: '#dc2626' }, // red
    { name: 'Player 2', color: '#16a34a' }, // green
    { name: 'Player 3', color: '#facc15' }, // yellow
    { name: 'Player 4', color: '#2563eb' }  // blue
  ];

  useEffect(() => {
    if (playersJoined < 4) {
      const interval = setInterval(() => {
        setPlayersJoined(prev => {
          if (prev < 4) {
            const newCount = prev + 1;
            setStatus(`Waiting for players... ${newCount}/4`);
            return newCount;
          }
          clearInterval(interval);
          return prev;
        });
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setTimeout(() => {
        setStatus('Match Starting...');
        setTimeout(() => {
          setIsGameStarted(true);
          setStatus("Player 2's Turn");
          setCurrentTurn('Player 2');
        }, 1500);
      }, 1000);
    }
  }, [playersJoined]);

  const handleDiceRoll = () => {
    if (currentTurn !== 'You') return; // Only roll if it's your turn
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    setDiceNumber(randomNumber);
    // Simulate server logic and turn change
    setTimeout(() => {
        const nextPlayerIndex = (players.findIndex(p => p.name === currentTurn) + 1) % players.length;
        const nextPlayer = players[nextPlayerIndex];
        setCurrentTurn(nextPlayer.name);
        setStatus(`${nextPlayer.name}'s Turn`);
    }, 2000);
  };

  const handleSendMessage = () => {
      if(newMessage.trim()){
          setMessages([...messages, {user: 'You', text: newMessage}]);
          setNewMessage('');
          // Simulate other player message
          setTimeout(() => {
              setMessages(prev => [...prev, {user: 'Player 3', text: 'Good luck!'}])
          }, 1000);
      }
  }

  const renderBoard = () => (
    <div className="grid grid-cols-11 grid-rows-11 aspect-square bg-card border-2 border-border rounded-md">
      {/* Player Bases */}
      <div className="col-span-5 row-span-5 bg-red-700/80 m-1 rounded-md flex items-center justify-center p-2">
        <div className="grid grid-cols-2 gap-2 bg-red-900/50 p-2 rounded-md">
            <LudoPiece color="#dc2626" /><LudoPiece color="#dc2626" /><LudoPiece color="#dc2626" /><LudoPiece color="#dc2626" />
        </div>
      </div>
      <div className="col-start-7 col-span-5 row-span-5 bg-green-700/80 m-1 rounded-md flex items-center justify-center p-2">
        <div className="grid grid-cols-2 gap-2 bg-green-900/50 p-2 rounded-md">
            <LudoPiece color="#16a34a" /><LudoPiece color="#16a34a" /><LudoPiece color="#16a34a" /><LudoPiece color="#16a34a" />
        </div>
      </div>
      <div className="col-span-5 row-start-7 row-span-5 bg-yellow-500/80 m-1 rounded-md flex items-center justify-center p-2">
         <div className="grid grid-cols-2 gap-2 bg-yellow-700/50 p-2 rounded-md">
            <LudoPiece color="#facc15" /><LudoPiece color="#facc15" /><LudoPiece color="#facc15" /><LudoPiece color="#facc15" />
        </div>
      </div>
      <div className="col-start-7 col-span-5 row-start-7 row-span-5 bg-blue-700/80 m-1 rounded-md flex items-center justify-center p-2">
         <div className="grid grid-cols-2 gap-2 bg-blue-900/50 p-2 rounded-md">
            <LudoPiece color="#2563eb" /><LudoPiece color="#2563eb" /><LudoPiece color="#2563eb" /><LudoPiece color="#2563eb" />
        </div>
      </div>

      {/* Center Home */}
      <div className="col-start-5 row-start-5 col-span-3 row-span-3 flex items-center justify-center">
         <div className="w-full h-full bg-red-500/50 -rotate-45"></div>
         <div className="w-full h-full bg-green-500/50 -rotate-45"></div>
         <div className="w-full h-full bg-yellow-500/50 -rotate-45"></div>
         <div className="w-full h-full bg-blue-500/50 -rotate-45"></div>
      </div>

      {/* Paths */}
      {Array.from({ length: 11 * 11 }).map((_, i) => {
        const row = Math.floor(i / 11);
        const col = i % 11;
        
        let pathClass = '';
        if ((col >= 0 && col < 5 && (row === 5)) || (row >=0 && row < 5 && col === 5)) pathClass = 'bg-red-500/20';
        if ((col > 5 && col < 11 && (row === 5)) || (row >=0 && row < 5 && col === 5)) pathClass = 'bg-green-500/20';
        if ((col > 5 && col < 11 && (row === 5)) || (row > 5 && row < 11 && col === 5)) pathClass = 'bg-blue-500/20';
        if ((col >= 0 && col < 5 && (row === 5)) || (row > 5 && row < 11 && col === 5)) pathClass = 'bg-yellow-500/20';

        if( (row > 0 && row < 5 && col === 5) || (row === 5 && col < 5 && col > 0) ) pathClass = 'bg-red-500';
        if( (row === 1 && col === 5) ) pathClass = 'bg-red-500/50';

        const isMiddleRow = row === 5;
        const isMiddleCol = col === 5;
        const isPath = (isMiddleRow && (col < 5 || col > 5)) || (isMiddleCol && (row < 5 || row > 5));

        if(isPath) return <div key={i} className={cn("border border-border/30", pathClass)}></div>;
        return null;
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon"><ArrowLeft /></Button>
        </Link>
        <h1 className="text-lg font-bold">Ludo Tournament</h1>
        <div className="w-10"></div>
      </header>

      {!isGameStarted ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <Dices className="w-24 h-24 animate-bounce text-primary" />
          <h2 className="text-2xl font-bold">{status}</h2>
          <p className="text-muted-foreground">Entry Fee: ₹10 | Prize Pool: ₹35</p>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto p-2 space-y-3">
          <Card className="bg-card/80">
            <CardContent className="p-2">
                <div className="grid grid-cols-2 gap-2">
                    {players.map(p => <PlayerInfo key={p.name} name={p.name} color={p.color} isTurn={currentTurn === p.name} />)}
                </div>
            </CardContent>
          </Card>
          
          <div className="relative flex items-center justify-center">
            {renderBoard()}
          </div>
          
          <div className="text-center font-bold text-lg">{status}</div>

          <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDiceRoll} disabled={currentTurn !== 'You'} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-8 py-8 rounded-2xl shadow-lg">
                <Dices className="w-8 h-8 mr-2"/>
                ROLL
              </Button>
              {diceNumber && (
                <div className="w-20 h-20 bg-background flex items-center justify-center rounded-2xl border-2 border-accent shadow-inner">
                    <span className="text-4xl font-bold text-accent">{diceNumber}</span>
                </div>
              )}
          </div>
            
          <Separator className="my-4 bg-gray-700"/>
            
          {/* Chat Box */}
          <div>
            <h3 className="font-semibold mb-2 px-1">Game Chat</h3>
            <Card className="bg-card/50">
              <CardContent className="p-2 space-y-2 h-24 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("text-sm", msg.user === 'You' ? 'text-right' : 'text-left')}>
                    <span className="font-bold">{msg.user}: </span>
                    <span>{msg.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex gap-2 mt-2">
                <Input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="bg-background border-gray-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} variant="secondary" size="icon"><Send /></Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

    
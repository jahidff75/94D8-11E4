'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Crown, Send, Dices, User, Mic, Flag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Helper component for player info
const PlayerInfo = ({ name, color, isTurn, isWinner, avatarUrl, country, flag }: { name: string; color: string; isTurn: boolean; isWinner?: boolean; avatarUrl: string; country: string; flag: React.ReactNode; }) => (
  <div className={cn("relative flex items-center gap-2 p-2 rounded-lg bg-card/80 border-2", isTurn ? "border-green-400 shadow-lg shadow-green-400/20" : "border-transparent")}>
     <div className="absolute -top-3 -right-2 bg-background px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-border">
        {flag}
        <span className="font-mono">{country}</span>
    </div>
    <Avatar className={cn("h-12 w-12 border-4", isTurn ? 'border-green-400' : 'border-gray-500')}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback style={{ backgroundColor: color, color: 'white' }}>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className='flex flex-col'>
        <span className="font-semibold text-sm">{name}</span>
        <div className="flex gap-1 mt-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
        </div>
    </div>
    {isWinner && <Crown className="w-6 h-6 text-yellow-400 absolute -top-3 -left-2" />}
  </div>
);

// Ludo Piece component
const LudoPiece = ({ color }: { color: string }) => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner" style={{ background: `radial-gradient(circle, ${color} 60%, hsl(from ${color} h s 20%))` }}>
     <div className="w-6 h-6 rounded-full" style={{background: color}}>
         <div className="w-full h-full rounded-full bg-white/30"></div>
     </div>
  </div>
);


// Main Ludo Game Page Component
export default function LudoGamePlayPage() {
  const [status, setStatus] = useState('Waiting for players... 1/4');
  const [playersJoined, setPlayersJoined] = useState(1);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState(''); // Player name
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const players = [
    { name: 'You', color: '#1e88e5', avatar: 'https://i.pravatar.cc/150?u=you', country: 'IN', flag: <INFlag /> },  // blue
    { name: 'Bot Messi', color: '#43a047', avatar: 'https://i.pravatar.cc/150?u=messi', country: 'UK', flag: <UKFlag /> }, // green
    { name: 'Bot Jenny', color: '#e53935', avatar: 'https://i.pravatar.cc/150?u=jenny', country: 'US', flag: <USFlag /> }, // red
    { name: 'Bot Praks', color: '#fdd835', avatar: 'https://i.pravatar.cc/150?u=praks', country: 'SD', flag: <SDFlag /> }  // yellow
  ];

  useEffect(() => {
    // Simulate players joining
    if (playersJoined < 4) {
      const interval = setInterval(() => {
        setPlayersJoined(prev => {
          const newCount = prev + 1;
          if (newCount <= 4) {
            setStatus(`Waiting for players... ${newCount}/4`);
            return newCount;
          }
          clearInterval(interval);
          return prev;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // All players joined, start the game
      if (!isGameStarted) {
        setTimeout(() => {
          setStatus('Match Starting...');
          setTimeout(() => {
            setIsGameStarted(true);
            const firstPlayer = players[0].name;
            setCurrentTurn(firstPlayer);
            setStatus(`${firstPlayer}'s Turn`);
          }, 1500);
        }, 1000);
      }
    }
  }, [playersJoined, isGameStarted]);
  
  // AI player logic
  useEffect(() => {
      if (isGameStarted && currentTurn && currentTurn !== 'You') {
          const botTurnTimeout = setTimeout(() => {
              handleDiceRoll();
          }, 2000); // AI "thinks" for 2 seconds
          return () => clearTimeout(botTurnTimeout);
      }
  }, [currentTurn, isGameStarted]);

  const handleDiceRoll = () => {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    setDiceValue(randomNumber);
    
    // Simulate server logic and turn change
    setTimeout(() => {
        const currentPlayerIndex = players.findIndex(p => p.name === currentTurn);
        if (randomNumber !== 6) {
          const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
          const nextPlayer = players[nextPlayerIndex];
          setCurrentTurn(nextPlayer.name);
          setStatus(`${nextPlayer.name}'s Turn`);
        } else {
          setStatus(`${currentTurn} rolled a 6! Roll again.`);
        }
        setDiceValue(null);
    }, 1500);
  };

  const handleSendMessage = () => {
      if(newMessage.trim()){
          setMessages([...messages, {user: 'You', text: newMessage}]);
          setNewMessage('');
          // Simulate other player message
          setTimeout(() => {
              setMessages(prev => [...prev, {user: 'Bot Messi', text: 'Haha!'}])
          }, 1000);
      }
  }

  const renderBoard = () => (
    <div className="aspect-square w-full max-w-md mx-auto bg-[#0b2157] border-4 border-yellow-400 rounded-2xl p-2 grid grid-cols-15 grid-rows-15 gap-px">
        {/* Bases */}
        <div className="col-span-6 row-span-6 bg-[#e53935] rounded-lg flex items-center justify-center p-2"><div className="grid grid-cols-2 gap-2 bg-white/80 p-2 rounded-md"><LudoPiece color="#e53935" /><LudoPiece color="#e53935" /><LudoPiece color="#e53935" /><LudoPiece color="#e53935" /></div></div>
        <div className="col-start-10 col-span-6 row-span-6 bg-[#43a047] rounded-lg flex items-center justify-center p-2"><div className="grid grid-cols-2 gap-2 bg-white/80 p-2 rounded-md"><LudoPiece color="#43a047" /><LudoPiece color="#43a047" /><LudoPiece color="#43a047" /><LudoPiece color="#43a047" /></div></div>
        <div className="col-span-6 row-start-10 row-span-6 bg-[#fdd835] rounded-lg flex items-center justify-center p-2"><div className="grid grid-cols-2 gap-2 bg-white/80 p-2 rounded-md"><LudoPiece color="#fdd835" /><LudoPiece color="#fdd835" /><LudoPiece color="#fdd835" /><LudoPiece color="#fdd835" /></div></div>
        <div className="col-start-10 row-start-10 row-span-6 bg-[#1e88e5] rounded-lg flex items-center justify-center p-2"><div className="grid grid-cols-2 gap-2 bg-white/80 p-2 rounded-md"><LudoPiece color="#1e88e5" /><LudoPiece color="#1e88e5" /><LudoPiece color="#1e88e5" /><LudoPiece color="#1e88e5" /></div></div>

        {/* Center Home Triangle */}
        <div className="col-start-7 row-start-7 col-span-3 row-span-3 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full transform rotate-45">
                <div className="w-1/2 h-1/2 bg-[#e53935] float-left"></div>
                <div className="w-1/2 h-1/2 bg-[#43a047] float-left"></div>
                <div className="w-1/2 h-1/2 bg-[#fdd835] float-left"></div>
                <div className="w-1/2 h-1/2 bg-[#1e88e5] float-left"></div>
            </div>
        </div>

        {/* Paths */}
        {Array.from({ length: 15 * 15 }).map((_, i) => {
            const row = Math.floor(i / 15);
            const col = i % 15;
            let bg = 'transparent';

            const isWhitePath = (row >= 6 && row <= 8) || (col >= 6 && col <= 8);
            if(isWhitePath) bg = 'white';

            // Red Path
            if (col === 7 && row > 0 && row < 6) bg = '#e53935';
            if (row === 6 && col > 0 && col < 6) bg = 'white';
             if(row === 6 && col === 1) bg = '#e53935';
            
            // Green Path
            if(row === 7 && col > 8 && col < 14) bg = '#43a047';
            if(col === 8 && row > 0 && row < 6) bg = 'white';
             if(col === 8 && row === 1) bg = '#43a047';

            // Yellow Path
            if (col === 7 && row > 8 && row < 14) bg = '#fdd835';
            if(row === 8 && col > 0 && col < 6) bg = 'white';
            if(row === 8 && col === 1) bg = '#fdd835';

            // Blue Path
            if(row === 7 && col > 0 && col < 6) bg = '#1e88e5';
            if(col === 6 && row > 8 && row < 14) bg = 'white';
            if(col === 6 && row === 13) bg = '#1e88e5';

            // Clean up middle path overrides
            if ( (row > 5 && row < 9) && (col > 5 && col < 9) ) bg = 'transparent';

            // Correcting main axis paths
            if (row === 7 && col >= 0 && col < 6) bg = 'white'; // left horizontal
            if (row === 7 && col > 8 && col < 15) bg = 'white'; // right horizontal
            if (col === 7 && row >= 0 && row < 6) bg = 'white'; // top vertical
            if (col === 7 && row > 8 && row < 15) bg = 'white'; // bottom vertical

             // Home paths
            if (row === 7 && col > 0 && col < 6) bg = '#e53935'; // Red home
            if (col === 7 && row > 8 && row < 14) bg = '#fdd835'; // Yellow home
            if (row === 7 && col > 8 && col < 14) bg = '#1e88e5'; // Blue home
            if (col === 7 && row > 0 && row < 6) bg = '#43a047'; // Green home

            // Arrow starting points
            const isStar = (row === 6 && col === 2) || (row === 2 && col === 8) || (row === 8 && col === 12) || (row === 12 && col === 6);


            if ((row >= 6 && row <= 8) || (col >= 6 && col <= 8)) {
                 if (i === 106) bg = '#e53935'; // Red Start
                 if (i === 38) bg = '#43a047'; // Green Start
                 if (i === 203) bg = '#fdd835'; // Yellow Start
                 if (i === 135) bg = '#1e88e5'; // Blue Start
                 return <div key={i} style={{ backgroundColor: bg }} className={cn("border-black/10", isStar && "bg-[url('https://img.icons8.com/ios-glyphs/30/star--v1.png')] bg-center bg-no-repeat bg-contain")}></div>
            }
            return null;
        })}
    </div>
  );

  const Dice = ({value}: {value: number | null}) => {
      const dots = Array.from({length: value || 0}).map((_, i) => {
          const pos = [
              [],
              [{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}],
              [{top: '25%', left: '25%'}, {bottom: '25%', right: '25%'}],
              [{top: '25%', left: '25%'}, {top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}, {bottom: '25%', right: '25%'}],
              [{top: '25%', left: '25%'}, {top: '25%', right: '25%'}, {bottom: '25%', left: '25%'}, {bottom: '25%', right: '25%'}],
              [{top: '25%', left: '25%'}, {top: '25%', right: '25%'}, {top: '50%', left: '25%'}, {top: '50%', right: '25%'}, {bottom: '25%', left: '25%'}, {bottom: '25%', right: '25%'}],
              [{top: '20%', left: '20%'}, {top: '20%', right: '20%'}, {top: '50%', left: '20%'}, {top: '50%', right: '20%'}, {bottom: '20%', left: '20%'}, {bottom: '20%', right: '20%'}],
          ][value || 1];
          if(value === 6) { // Special case for 6 dots layout
               pos.splice(2, 2);
               pos.push({top: '50%', left: '25%'}, {top: '50%', right: '25%'});
          }
          return <div key={i} className="absolute w-3 h-3 bg-black rounded-full" style={pos[i]}></div>;
      });

      return (
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 relative shadow-md">
            {value ? dots : <Dices className="w-8 h-8 animate-pulse"/>}
        </div>
      )
  }

  const INFlag = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 15" className="w-5 h-5 rounded-sm"><rect width="21" height="15" fill="#f93"/><rect width="21" height="10" fill="#fff"/><rect width="21" height="5" fill="#128807"/><circle cx="10.5" cy="7.5" r="1.7" fill="#008"/><circle cx="10.5" cy="7.5" r="1.5" fill="#fff"/><path d="m10.5 7.5 0-1.5 a.15 .15 90 0 0 0 3zm-3.5-2.2.45.2a1.5 1.5 0 0 1-1.3 2.6l-.45.2a2 2 0 0 0 1.3-3z" fill="#008"/></svg>
  const UKFlag = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-5 rounded-sm"><clipPath id="a"><path d="M0 0h60v30H0z"/></clipPath><path d="M0 0v30h60V0z" fill="#00247d"/><path d="M0 0L60 30m0-30L0 30" stroke="#fff" strokeWidth="6" clipPath="url(#a)"/><path d="M0 0L60 30m0-30L0 30" stroke="#cf142b" strokeWidth="4" clipPath="url(#a)"/><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/><path d="M30 0v30M0 15h60" stroke="#cf142b" strokeWidth="6"/></svg>
  const SDFlag = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" className="w-5 h-5 rounded-sm"><path fill="#fff" d="M0 0h9v6H0z"/><path fill="red" d="M0 0h9v2H0z"/><path d="M0 4h9v2H0z"/><path fill="#007229" d="m0 0 3 3-3 3z"/></svg>
  const USFlag = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" className="w-5 h-5 rounded-sm"><path fill="#b22234" d="M0 0h7410v3900H0z"/><path stroke="#fff" strokeWidth="300" d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"/><path fill="#3c3b6e" d="M0 0h3960v2100H0z"/></svg>

  return (
    <div className="flex flex-col h-screen bg-cover bg-center" style={{backgroundImage: "url('https://i.ibb.co/3k5g72f/ludo-bg.jpg')"}}>
      <header className="flex items-center justify-between p-2">
        <Link href="/games/ludo" passHref>
          <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><ArrowLeft /></Button>
        </Link>
        <div className="flex items-center gap-2">
            {/* Can add more icons here */}
        </div>
      </header>

      {!isGameStarted ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <Dices className="w-24 h-24 animate-bounce text-white" />
          <h2 className="text-2xl font-bold text-white bg-black/50 px-4 py-2 rounded-lg">{status}</h2>
        </div>
      ) : (
        <main className="flex-1 flex flex-col p-2 space-y-2 justify-between">
          <div className="grid grid-cols-2 gap-4">
            <PlayerInfo name={players[2].name} color={players[2].color} isTurn={currentTurn === players[2].name} avatarUrl={players[2].avatar} country={players[2].country} flag={players[2].flag} />
            <PlayerInfo name={players[1].name} color={players[1].color} isTurn={currentTurn === players[1].name} avatarUrl={players[1].avatar} country={players[1].country} flag={players[1].flag} />
          </div>

          <div className="relative flex items-center justify-center">
            {renderBoard()}
            <div className="absolute flex items-center justify-center flex-col gap-2">
                <div className="p-3 bg-red-600 rounded-full border-4 border-white shadow-2xl">
                    <Mic className="w-8 h-8 text-white"/>
                </div>
                 <p className="text-white font-bold text-lg bg-black/50 px-3 py-1 rounded-md">{status}</p>
            </div>
          </div>
          
           <div className="grid grid-cols-2 gap-4">
            <PlayerInfo name={players[3].name} color={players[3].color} isTurn={currentTurn === players[3].name} avatarUrl={players[3].avatar} country={players[3].country} flag={players[3].flag} />
            <PlayerInfo name={players[0].name} color={players[0].color} isTurn={currentTurn === players[0].name} avatarUrl={players[0].avatar} country={players[0].country} flag={players[0].flag} />
          </div>

          <div className="flex items-center justify-around p-2 bg-black/30 rounded-xl">
             <div className="flex flex-col items-center">
                <Dice value={diceValue} />
             </div>

             <div className="flex gap-2">
                <Input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Message..." 
                    className="bg-black/50 border-gray-600 text-white placeholder:text-gray-300 w-32"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} variant="secondary" size="icon" className="bg-blue-600 hover:bg-blue-700 text-white"><Send /></Button>
            </div>
              <Button onClick={handleDiceRoll} disabled={currentTurn !== 'You' || diceValue !== null} className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold text-lg px-6 py-6 rounded-2xl shadow-lg border-2 border-white disabled:opacity-50">
                  <Dices className="w-6 h-6 mr-2"/>
                  ROLL
              </Button>
          </div>
        </main>
      )}
    </div>
  );
}

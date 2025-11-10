'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Crown, Send, Settings, Coins } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Helper Components ---

const PlayerInfo = ({ name, avatarUrl, isTurn, score, color }: { name: string; avatarUrl: string; isTurn: boolean; score: number; color: string }) => (
  <div className={cn("relative flex items-center gap-3 p-2 rounded-lg bg-black/50 border-2", isTurn ? "border-yellow-400 shadow-lg shadow-yellow-400/20" : "border-transparent")}>
    <Avatar className={cn("h-12 w-12 border-4", isTurn ? 'border-yellow-400' : 'border-gray-600')}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback style={{ backgroundColor: color }}>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className='text-white'>
      <span className="font-bold text-sm">{name}</span>
      <p className="text-xs text-gray-300">Score: {score}</p>
    </div>
  </div>
);

const CarromPiece = ({ type, className }: { type: 'black' | 'white' | 'red' | 'striker', className?: string }) => {
    const colorClass = {
        black: 'bg-gray-800 border-gray-900',
        white: 'bg-amber-100 border-amber-200',
        red: 'bg-red-600 border-red-700',
        striker: 'bg-blue-400 border-blue-600 border-4'
    }[type];
    const sizeClass = type === 'striker' ? 'w-10 h-10' : 'w-6 h-6';

    return (
        <div className={cn('rounded-full border-2 shadow-md flex items-center justify-center', colorClass, sizeClass, className)}>
            <div className={cn('w-3/4 h-3/4 rounded-full', {'bg-white/20': type !== 'striker'})}></div>
        </div>
    );
};


// --- Main Game Logic & State ---

export default function CarromGamePage() {
    const [status, setStatus] = useState('Waiting for opponent...');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(''); // Player name
    const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const players = [
        { id: 0, name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', score: 0, color: '#1e88e5' },
        { id: 1, name: 'Rohan', avatar: 'https://i.pravatar.cc/150?u=rohan', score: 0, color: '#e53935' },
    ];

    useEffect(() => {
        setTimeout(() => {
            setIsGameStarted(true);
            setStatus("Rohan's Turn");
            setCurrentTurn('Rohan');
        }, 3000);
    }, []);

    const handleSendMessage = () => {
        if(newMessage.trim()){
            setMessages([...messages, {user: 'You', text: newMessage}]);
            setNewMessage('');
            setTimeout(() => {
                setMessages(prev => [...prev, {user: 'Rohan', text: 'Good luck!'}])
            }, 1000);
        }
    }
    
    const renderBoard = () => (
        <div className="aspect-square w-full max-w-md mx-auto bg-amber-200 border-[16px] border-red-900 rounded-md p-2 relative shadow-2xl">
            {/* Pockets */}
            <div className="absolute top-1 left-1 w-12 h-12 bg-black rounded-full"></div>
            <div className="absolute top-1 right-1 w-12 h-12 bg-black rounded-full"></div>
            <div className="absolute bottom-1 left-1 w-12 h-12 bg-black rounded-full"></div>
            <div className="absolute bottom-1 right-1 w-12 h-12 bg-black rounded-full"></div>

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 border-4 border-red-700 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-700 rounded-full"></div>
                </div>
            </div>

            {/* Pieces Arrangement */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <CarromPiece type="red" className="absolute -translate-x-1/2 -translate-y-1/2" />
                <CarromPiece type="white" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(30deg) translate(1.8rem) rotate(-30deg)'}}/>
                <CarromPiece type="black" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(60deg) translate(1.8rem) rotate(-60deg)'}}/>
                <CarromPiece type="white" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(90deg) translate(1.8rem) rotate(-90deg)'}}/>
                <CarromPiece type="black" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(120deg) translate(1.8rem) rotate(-120deg)'}}/>
                <CarromPiece type="white" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(150deg) translate(1.8rem) rotate(-150deg)'}}/>
                <CarromPiece type="black" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(180deg) translate(1.8rem) rotate(-180deg)'}}/>
                <CarromPiece type="white" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(210deg) translate(1.8rem) rotate(-210deg)'}}/>
                <CarromPiece type="black" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(240deg) translate(1.8rem) rotate(-240deg)'}}/>
                <CarromPiece type="white" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(270deg) translate(1.8rem) rotate(-270deg)'}}/>
                <CarromPiece type="black" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(300deg) translate(1.8rem) rotate(-300deg)'}}/>
                <CarromPiece type="white" className="absolute" style={{transform: 'translate(-50%, -50%) rotate(330deg) translate(1.8rem) rotate(-330deg)'}}/>
            </div>
            
            {/* Striker Base Lines */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-16 h-12 w-48 border-4 border-red-800 rounded-full flex items-center justify-between px-2">
                 <div className="w-6 h-6 rounded-full bg-red-800"></div>
                 <div className="w-6 h-6 rounded-full bg-red-800"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-16 h-12 w-48 border-4 border-red-800 rounded-full flex items-center justify-between px-2 rotate-180">
                 <div className="w-6 h-6 rounded-full bg-red-800"></div>
                 <div className="w-6 h-6 rounded-full bg-red-800"></div>
            </div>

            {/* Striker */}
            <CarromPiece type="striker" className="absolute left-1/2 -translate-x-1/2 bottom-[4.5rem]" />
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-cover bg-center bg-gray-800" style={{backgroundImage: "url('https://i.ibb.co/3k5g72f/ludo-bg.jpg')"}}>
            <header className="flex items-center justify-between p-2">
                <Link href="/games/carrom" passHref>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><ArrowLeft /></Button>
                </Link>
                <div className="text-center">
                    <p className="text-sm text-gray-300">Prize Pool</p>
                    <p className="font-bold text-lg text-yellow-400 flex items-center gap-1"><Coins className="w-5 h-5"/> 350</p>
                </div>
                <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/50 hover:text-white"><Settings /></Button>
            </header>

            {!isGameStarted ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-4 text-white">
                    <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-blue-500"><AvatarImage src={players[0].avatar} /></Avatar>
                        <span className="absolute -bottom-2 -left-4 text-4xl">vs</span>
                        <Avatar className="w-24 h-24 border-4 border-red-500 absolute top-8 left-16"><AvatarImage src={players[1].avatar} /></Avatar>
                    </div>
                     <h2 className="text-2xl font-bold mt-20 bg-black/50 px-4 py-2 rounded-lg">{status}</h2>
                </div>
            ) : (
                <main className="flex-1 flex flex-col p-2 space-y-2 justify-between">
                    <PlayerInfo name={players[1].name} avatarUrl={players[1].avatar} isTurn={currentTurn === players[1].name} score={players[1].score} color={players[1].color} />

                    <div className="relative flex items-center justify-center">
                        {renderBoard()}
                    </div>
                    
                    <PlayerInfo name={players[0].name} avatarUrl={players[0].avatar} isTurn={currentTurn === players[0].name} score={players[0].score} color={players[0].color} />

                    <div className="flex items-center justify-around p-2 bg-black/30 rounded-xl gap-2">
                        <div className="flex-1 flex gap-2">
                            <Input 
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Message..." 
                                className="bg-black/50 border-gray-600 text-white placeholder:text-gray-300 w-full"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage} variant="secondary" size="icon" className="bg-blue-600 hover:bg-blue-700 text-white"><Send /></Button>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
}

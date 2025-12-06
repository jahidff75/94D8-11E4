'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Plus, Minus, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type Player = {
    name: string;
    avatar: string;
    health: number;
    color: string;
    tankPos: { x: number; y: number };
}

export default function GamePlayPage() {
    const [status, setStatus] = useState('Finding Opponent...');
    const [players, setPlayers] = useState<Player[]>([]);
    const [turn, setTurn] = useState<string>('You');
    const [angle, setAngle] = useState(45);
    const [power, setPower] = useState(70);
    const [projectile, setProjectile] = useState<{x: number, y: number, vx: number, vy: number} | null>(null);
    const [explosion, setExplosion] = useState<{x: number, y: number} | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setPlayers([
                { name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', health: 100, color: 'text-green-500', tankPos: { x: 15, y: 80 } },
                { name: 'RivalPlayer', avatar: 'https://i.pravatar.cc/150?u=rival', health: 100, color: 'text-red-500', tankPos: { x: 85, y: 80 } },
            ]);
            setStatus('Your turn to fire!');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // Projectile physics
    useEffect(() => {
        if (!projectile) return;
        
        const physicsInterval = setInterval(() => {
            setProjectile(p => {
                if (!p) return null;
                const newX = p.x + p.vx;
                const newY = p.y + p.vy;
                const newVy = p.vy + 0.1; // gravity
                
                // Check for collision with ground
                if (newY >= 85) {
                    setExplosion({x: newX, y: 85});
                    clearInterval(physicsInterval);
                    // Check for damage
                    const opponent = players.find(pl => pl.name !== turn);
                    if (opponent && Math.abs(newX - opponent.tankPos.x) < 10) {
                         setPlayers(ps => ps.map(pl => pl.name === opponent.name ? {...pl, health: Math.max(0, pl.health - 30)} : pl));
                    }
                    setTimeout(() => {
                        setExplosion(null);
                        setTurn(t => t === 'You' ? 'RivalPlayer' : 'You');
                    }, 1000);
                    return null;
                }
                return { ...p, x: newX, y: newY, vy: newVy };
            });
        }, 30);

        return () => clearInterval(physicsInterval);
    }, [projectile]);
    
    // AI Turn
    useEffect(() => {
        if (turn === 'RivalPlayer' && !winner) {
            const aiTurnTimeout = setTimeout(() => {
                // Simple AI logic
                const aiAngle = 135;
                const aiPower = Math.random() * 30 + 50;
                fire(aiAngle, aiPower, players[1].tankPos);
            }, 2000);
            return () => clearTimeout(aiTurnTimeout);
        }
    }, [turn, winner, players]);
    
    // Check winner
    useEffect(() => {
        const you = players.find(p => p.name === 'You');
        const rival = players.find(p => p.name === 'RivalPlayer');
        if (you && you.health <= 0) setWinner('RivalPlayer');
        if (rival && rival.health <= 0) setWinner('You');
    }, [players]);

    const fire = (fireAngle: number, firePower: number, startPos: {x:number, y:number}) => {
        const rad = (fireAngle * Math.PI) / 180;
        const vx = Math.cos(rad) * (firePower / 10);
        const vy = Math.sin(rad) * (firePower / 10);
        setProjectile({ x: startPos.x, y: startPos.y, vx: vx, vy: -vy });
    };
    
    const handleFire = () => {
        if(turn !== 'You' || projectile) return;
        fire(angle, power, players[0].tankPos);
    };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/tank" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Tank Battle</h1>
        <div className="w-10"></div>
      </header>

      {players.length === 0 ? (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                     <div className="flex justify-center items-center space-x-8">
                        <Avatar className="w-24 h-24 border-4 border-blue-500"><AvatarImage src="https://i.pravatar.cc/150?u=you" /><AvatarFallback>YOU</AvatarFallback></Avatar>
                        <span className="text-4xl font-bold text-primary animate-pulse">VS</span>
                        <div className="w-24 h-24 border-4 border-dashed border-red-500 rounded-full flex items-center justify-center"><Timer className="w-12 h-12 text-red-500 animate-spin" /></div>
                    </div>
                    <h2 className="text-2xl font-bold animate-pulse">{status}</h2>
                </div>
            </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-4 bg-cover" style={{backgroundImage: "url('https://img.freepik.com/free-vector/military-battlefield-landscape-scene_1308-89311.jpg')"}}>
            <div className="w-full max-w-lg aspect-video bg-sky-400/30 rounded-lg border-4 border-gray-600 shadow-2xl relative p-4 overflow-hidden">
                {/* Health Bars */}
                <div className="absolute top-2 left-2 w-1/4"><div className="text-xs">{players[0].name}</div><div className="h-2 bg-red-500 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{width: `${players[0].health}%`}}></div></div></div>
                <div className="absolute top-2 right-2 w-1/4"><div className="text-xs text-right">{players[1].name}</div><div className="h-2 bg-red-500 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{width: `${players[1].health}%`}}></div></div></div>

                {/* Ground */}
                <div className="absolute bottom-0 left-0 w-full h-1/5 bg-yellow-900/70"></div>
                
                {/* Your Tank */}
                <div className="absolute text-5xl" style={{ left: `${players[0].tankPos.x}%`, top: `${players[0].tankPos.y}%`, transform: 'translate(-50%, -50%)'}}><span className={players[0].color}>⚫️</span><span className={players[0].color}>🟩</span></div>
                
                {/* Opponent Tank */}
                <div className="absolute text-5xl -scale-x-100" style={{ left: `${players[1].tankPos.x}%`, top: `${players[1].tankPos.y}%`, transform: 'translate(-50%, -50%) scaleX(-1)'}}><span className={players[1].color}>⚫️</span><span className={players[1].color}>🟥</span></div>
                
                {/* Projectile */}
                {projectile && <div className="absolute w-3 h-3 bg-black rounded-full" style={{left: `${projectile.x}%`, top: `${projectile.y}%`}}></div>}
                {explosion && <div className="absolute text-5xl animate-ping" style={{left: `${explosion.x}%`, top: `${explosion.y - 10}%`}}>💥</div>}
            </div>
            
            {winner && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <h2 className="text-4xl font-bold text-white mt-4">{winner} wins!</h2>
                    <Link href="/games/tank" passHref>
                        <Button className="mt-6">Play Again</Button>
                    </Link>
                 </div>
             )}

            <div className="w-full max-w-lg mt-4 flex justify-between items-center p-4 bg-black/50 rounded-lg">
                <div className="w-1/3">
                    <p>Angle: {angle}°</p>
                    <Slider value={[angle]} onValueChange={(v) => setAngle(v[0])} max={180} step={1} disabled={turn !== 'You'} />
                </div>
                <div className="w-1/3">
                    <p>Power: {power}%</p>
                     <Slider value={[power]} onValueChange={(v) => setPower(v[0])} max={100} step={1} disabled={turn !== 'You'} />
                </div>
                <Button onClick={handleFire} disabled={turn !== 'You' || !!projectile} className="px-10 py-6 text-xl bg-red-600">FIRE!</Button>
            </div>
        </main>
      )}

    </div>
  );
}

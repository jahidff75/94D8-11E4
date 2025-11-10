'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Ticket, Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const feeOptions = [
  { fee: 2, prize: 7, players: 4 },
  { fee: 5, prize: 18, players: 4 },
  { fee: 10, prize: 35, players: 4 },
  { fee: 15, prize: 53, players: 4 },
  { fee: 20, prize: 70, players: 4 },
  { fee: 30, prize: 105, players: 4 },
  { fee: 50, prize: 175, players: 4 },
];

export default function LudoHomePage() {
  const router = useRouter();

  const handlePlay = (fee: number) => {
    router.push(`/games/ludo/play?fee=${fee}`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Ludo King</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card className="bg-primary/10 border-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-primary">
              Choose Your Battle!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Select an entry fee to join a Ludo match and win exciting prizes.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {feeOptions.map((option) => (
            <Card
              key={option.fee}
              className="bg-card hover:bg-secondary border-border hover:border-primary transition-all duration-300 cursor-pointer"
              onClick={() => handlePlay(option.fee)}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className="flex justify-center items-center gap-2">
                  <Ticket className="w-5 h-5 text-accent" />
                  <p className="text-sm text-muted-foreground">Entry Fee</p>
                </div>
                <p className="text-3xl font-bold">₹{option.fee}</p>

                <div className="border-t border-dashed border-border my-2"></div>

                <div className="space-y-2 text-sm">
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-1 text-muted-foreground">
                        <Trophy className="w-4 h-4"/>
                        <span>Prize</span>
                     </div>
                    <span className="font-semibold text-success">₹{option.prize}</span>
                  </div>
                   <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4"/>
                        <span>Players</span>
                     </div>
                    <span className="font-semibold">{option.players}</span>
                  </div>
                </div>
                
                 <Button className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  PLAY
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

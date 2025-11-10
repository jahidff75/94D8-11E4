'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, ArrowLeft, Gem, BarChart, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const feeOptions = [
  { fee: 20, prize: 70, players: 1 },
  { fee: 50, prize: 180, players: 1 },
  { fee: 100, prize: 350, players: 1 },
];

export default function FruitHomePage() {
  const router = useRouter();
  const [selectedFee, setSelectedFee] = useState<number | null>(100);

  const handlePlay = () => {
    if (selectedFee !== null) {
      router.push(`/games/fruit/play?fee=${selectedFee}`);
    }
  };
  
  const gameBanner = PlaceHolderImages.find(p => p.id === 'fruit');

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Fruit Samurai</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-between">
        <div>
            <Card className="overflow-hidden mb-4 border-primary/50">
                <CardContent className="relative aspect-video p-0">
                <Image
                    src={gameBanner?.imageUrl || "https://picsum.photos/seed/fruit/600/400"}
                    alt={"Fruit Samurai Game"}
                    fill
                    className="object-cover"
                    data-ai-hint={gameBanner?.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">DOXPOW FRUIT SAMURAI</h2>
                    <p className="text-sm text-gray-200">Play and win exciting cash prizes!</p>
                </div>
                </CardContent>
            </Card>
             <div className="grid grid-cols-3 gap-2 mb-6">
                <Button variant="secondary" className="bg-primary/20 hover:bg-primary/30">
                    <Trophy className="mr-2 h-4 w-4" /> Results
                </Button>
                <Button variant="secondary" className="bg-primary/20 hover:bg-primary/30">
                    <BookOpen className="mr-2 h-4 w-4" /> Learn
                </Button>
                <Button variant="secondary" className="bg-primary/20 hover:bg-primary/30">
                    <BarChart className="mr-2 h-4 w-4" /> Leaderboard
                </Button>
            </div>
        </div>
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">Choose Entry Amount</h3>
            <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
                {feeOptions.map((option) => (
                <Button
                    key={option.fee}
                    variant={selectedFee === option.fee ? 'default' : 'outline'}
                    className={cn(
                        "flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 text-lg font-bold transition-all duration-200",
                        selectedFee === option.fee 
                            ? 'bg-primary border-primary-foreground shadow-lg scale-110' 
                            : 'bg-background/50 border-primary/50 text-white'
                    )}
                    onClick={() => setSelectedFee(option.fee)}
                >
                    <div className="flex items-center gap-1">
                        <Gem className="w-4 h-4" />
                        <span>{option.fee}</span>
                    </div>
                    <span className="text-xs font-normal mt-1 text-primary-foreground/80">Win {option.prize}</span>
                </Button>
                ))}
            </div>
            <Button 
                onClick={handlePlay} 
                disabled={selectedFee === null}
                className="w-full max-w-sm py-6 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-full shadow-lg"
            >
                PLAY NOW
            </Button>
        </div>
      </main>
    </div>
  );
}

'use client';
import Image from "next/image";
import {
  Bell,
  Wallet,
  Swords,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { gameCategories } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BottomNav from "@/components/layout/bottom-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(gameCategories[0].id);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const walletRef = useMemoFirebase(() => {
      if (!user) return null;
      return doc(firestore, `users/${user.uid}/wallet`, 'main');
  }, [firestore, user]);

  const { data: walletData } = useDoc<any>(walletRef);
  
  const totalBalance = (walletData?.depositCash || 0) + (walletData?.winningsCash || 0) + (walletData?.bonusCash || 0);

  const getGameImage = (gameId: string) => {
    return (
      PlaceHolderImages.find((img) => img.id === gameId)?.imageUrl ||
      "https://picsum.photos/seed/default/200/200"
    );
  };
  const getGameImageHint = (gameId: string) => {
    return PlaceHolderImages.find((img) => img.id === gameId)?.imageHint;
  };

  const featuredBanners = PlaceHolderImages.filter(p => p.id.startsWith('banner_'));

  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center h-dvh">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Link href="/profile">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Swords />
            </div>
        </Link>
        <div className="flex-1 flex justify-center">
             <Link href="/wallet" className="flex items-center gap-2 rounded-full bg-card p-2 px-4 border-2 border-primary/50 shadow-lg">
                <Wallet className="h-6 w-6 text-yellow-400" />
                <span className="font-semibold text-lg">₹{totalBalance.toFixed(2)}</span>
            </Link>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>
      </header>

      {/* Game Categories */}
      <section className="px-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
            {gameCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-lg font-bold text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none"
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {gameCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="pt-6">
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {category.banners.map((bannerId, index) => {
                      const banner = featuredBanners.find(b => b.id === bannerId);
                      if (!banner) return null;
                      return (
                        <CarouselItem key={index}>
                          <Card className="overflow-hidden border-primary/50">
                            <CardContent className="relative aspect-video p-0">
                              <Image
                                src={banner?.imageUrl || ""}
                                alt={banner.description}
                                fill
                                className="object-cover"
                                data-ai-hint={banner?.imageHint}
                              />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>

               <div className="grid grid-cols-3 gap-4 mt-6">
                {category.games.map((game) => (
                  <Link href={`/games/${game.id}`} key={game.id}>
                    <Card
                      className="group overflow-hidden relative border-border hover:border-primary transition-all duration-300"
                    >
                      <CardContent className="flex flex-col items-center justify-center p-0">
                        <div className="w-full aspect-square relative">
                            <Image
                              src={getGameImage(game.id)}
                              alt={game.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={getGameImageHint(game.id)}
                            />
                        </div>
                        <div className="p-2 text-center w-full bg-card/80 backdrop-blur-sm">
                          <h3 className="font-semibold truncate text-xs">{game.name}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <BottomNav />
    </div>
  );
}

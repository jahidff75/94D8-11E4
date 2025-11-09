import Image from "next/image";
import {
  Bell,
  Wallet,
  Swords,
  Dice5,
  Car,
  Bot,
  CircleDollarSign,
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { games, offers, featuredBanners, user } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export default function Home() {
  const getGameIcon = (gameName: string) => {
    switch (gameName) {
      case "Free Fire":
        return <Swords className="w-8 h-8 text-primary" />;
      case "BGMI":
        return <Swords className="w-8 h-8 text-amber-500" />;
      case "Ludo King":
        return <Dice5 className="w-8 h-8 text-green-500" />;
      case "Carrom":
        return <Car className="w-8 h-8 text-red-500" />;
      case "Snake & Ladder":
        return <Bot className="w-8 h-8 text-blue-500" />;
      default:
        return <Swords className="w-8 h-8 text-primary" />;
    }
  };

  const getGameImage = (gameId: string) => {
    return (
      PlaceHolderImages.find((img) => img.id === gameId)?.imageUrl ||
      "https://picsum.photos/seed/default/200/200"
    );
  };
  const getGameImageHint = (gameId: string) => {
    return PlaceHolderImages.find((img) => img.id === gameId)?.imageHint;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-bold text-primary">Doxpow</h1>
        <div className="flex items-center gap-4">
          <Bell className="h-6 w-6" />
          <Link href="/wallet" className="flex items-center gap-2 rounded-full bg-card p-2">
            <Wallet className="h-6 w-6 text-accent" />
            <span className="font-semibold">₹{user.totalBalance}</span>
          </Link>
        </div>
      </header>

      {/* Featured Carousel */}
      <section className="px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredBanners.map((banner, index) => {
              const bannerImage = PlaceHolderImages.find(
                (img) => img.id === banner.imageId
              );
              return (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden border-primary/50">
                    <CardContent className="relative aspect-video p-0">
                      <Image
                        src={bannerImage?.imageUrl || ""}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        data-ai-hint={bannerImage?.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                        <h2 className="text-xl font-bold text-white">
                          {banner.title}
                        </h2>
                        <p className="text-sm text-gray-300">{banner.desc}</p>
                        <Button
                          size="sm"
                          className="mt-2 w-fit bg-primary hover:bg-primary/90"
                        >
                          {banner.buttonText}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </section>

      {/* Game Selection Grid */}
      <section className="px-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {games.map((game) => (
            <Card
              key={game.id}
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
                     <div className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        LIVE
                    </div>
                </div>

                <div className="p-3 text-center w-full bg-card/80 backdrop-blur-sm">
                  <h3 className="font-semibold truncate">{game.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {game.liveMatches} Matches Live
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Promotion Section */}
      <section>
        <h2 className="px-4 text-lg font-semibold mb-2">Offers For You</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            {offers.map((offer) => {
              const offerImage = PlaceHolderImages.find(
                (img) => img.id === offer.imageId
              );
              return (
                <Card
                  key={offer.id}
                  className="w-72 overflow-hidden shrink-0"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      <Image
                        src={offerImage?.imageUrl || ""}
                        alt={offer.title}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                        data-ai-hint={offerImage?.imageHint}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">
                          {offer.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {offer.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <CircleDollarSign className="mr-2 h-4 w-4" />
                        {offer.buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Refer & Earn Banner */}
      <section className="px-4">
        <div className="rounded-lg bg-gradient-to-r from-primary to-purple-600 p-6 text-primary-foreground text-center">
          <h2 className="text-2xl font-bold">Invite a Friend</h2>
          <p className="mt-1">
            & Earn <span className="font-bold text-accent">₹100</span> Bonus
            Cash!
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent border-accent text-accent hover:bg-accent/20"
          >
            Invite Now
          </Button>
        </div>
      </section>
    </div>
  );
}

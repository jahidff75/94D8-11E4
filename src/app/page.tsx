import Image from "next/image";
import {
  Bell,
  Wallet,
  Swords,
  Dice5,
  Car,
  Bot,
  CircleDollarSign,
  TramFront,
  Gem,
  PocketKnife,
  BookCopy,
  Users,
  Target,
  Dices,
  Puzzle,
  Spade,
  Heart,
  Club,
  Diamond,
  Crown,
  Ship,
  Bike,
  Plane,
  Rocket,
  Bomb,
  Mountain,
  Pin,
  Ghost,
  Fish,
  Footprints,
  Grape,
  Cherry,
  Apple,
  Bone,
  ToyBrick,
  Castle,
  Cookie,
  Croissant,
  Donut,
  Egg,
  Gift,
  Cake,
  Key,
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
      case "Metro Surface":
        return <TramFront className="w-8 h-8 text-slate-500" />;
      case "Poker":
        return <Gem className="w-8 h-8 text-purple-500" />;
      case "8 Ball Pool":
        return <Target className="w-8 h-8 text-emerald-500" />;
      case "Fruit Samurai":
        return <PocketKnife className="w-8 h-8 text-rose-500" />;
       case "Rummy":
        return <BookCopy className="w-8 h-8 text-orange-500" />;
      case "Teen Patti": return <Users className="w-8 h-8 text-pink-500" />;
      case "Call Break": return <Spade className="w-8 h-8 text-gray-500" />;
      case "Solitaire": return <Heart className="w-8 h-8 text-red-600" />;
      case "Knife Up": return <PocketKnife className="w-8 h-8 text-gray-400" />;
      case "Bubble Shooter": return <Cherry className="w-8 h-8 text-pink-400" />;
      case "Archery King": return <Target className="w-8 h-8 text-yellow-600" />;
      case "Fantasy Cricket": return <Users className="w-8 h-8 text-orange-600" />;
      case "Chess": return <Crown className="w-8 h-8 text-gray-700" />;
      case "Air Hockey": return <Pin className="w-8 h-8 text-blue-400" />;
      case "Tank Battle": return <Bomb className="w-8 h-8 text-black" />;
      case "Racing Clash": return <Bike className="w-8 h-8 text-red-700" />;
      case "Space Hunter": return <Rocket className="w-8 h-8 text-purple-600" />;
      case "Zombie Smash": return <Ghost className="w-8 h-8 text-green-600" />;
      case "Fish Frenzy": return <Fish className="w-8 h-8 text-blue-600" />;
      case "Block Puzzle": return <Puzzle className="w-8 h-8 text-yellow-500" />;
      case "Jungle Run": return <Footprints className="w-8 h-8 text-green-700" />;
      case "Candy Crush": return <Grape className="w-8 h-8 text-purple-400" />;
      case "Mine Runner": return <Mountain className="w-8 h-8 text-gray-500" />;
      case "Street Racer": return <Car className="w-8 h-8 text-yellow-400" />;
      case "Plane Mayhem": return <Plane className="w-8 h-8 text-blue-300" />;
      case "Ship Wars": return <Ship className="w-8 h-8 text-gray-600" />;
      case "Dominoes": return <Dices className="w-8 h-8 text-black" />;
      case "Backgammon": return <Dices className="w-8 h-8 text-orange-700" />;
      case "Checkers": return <CircleDollarSign className="w-8 h-8 text-gray-800" />;
      case "Crazy 8s": return <Spade className="w-8 h-8 text-red-500" />;
      case "Go Fish": return <Fish className="w-8 h-8 text-cyan-500" />;
      case "Hearts": return <Heart className="w-8 h-8 text-red-400" />;
      case "Spades": return <Spade className="w-8 h-8 text-black" />;
      case "Bridge": return <Club className="w-8 h-8 text-black" />;
      case "Euchre": return <Diamond className="w-8 h-8 text-blue-500" />;
      case "Pinochle": return <BookCopy className="w-8 h-8 text-yellow-700" />;
      case "Canasta": return <Users className="w-8 h-8 text-green-500" />;
      case "Gin Rummy": return <BookCopy className="w-8 h-8 text-red-700" />;
      case "Mahjong": return <ToyBrick className="w-8 h-8 text-teal-500" />;
      case "Sudoku": return <Puzzle className="w-8 h-8 text-gray-400" />;
      case "Word Finder": return <BookCopy className="w-8 h-8 text-blue-400" />;
      case "Crossword": return <Puzzle className="w-8 h-8 text-black" />;
      case "Jigsaw Puzzle": return <Puzzle className="w-8 h-8 text-orange-400" />;
      case "Memory Game": return <Bot className="w-8 h-8 text-pink-400" />;
      case "Brick Breaker": return <ToyBrick className="w-8 h-8 text-red-600" />;
      case "2048": return <Dices className="w-8 h-8 text-yellow-600" />;
      case "Tetris": return <Puzzle className="w-8 h-8 text-purple-500" />;
      case "Pac-Man": return <Ghost className="w-8 h-8 text-yellow-400" />;
      case "Donkey Kong": return <Mountain className="w-8 h-8 text-yellow-800" />;
      case "Galaga": return <Rocket className="w-8 h-8 text-red-400" />;
      case "Frogger": return <Footprints className="w-8 h-8 text-green-400" />;
      case "Centipede": return <Bot className="w-8 h-8 text-green-300" />;
      case "Missile Command": return <Bomb className="w-8 h-8 text-orange-500" />;
      case "Asteroids": return <Bomb className="w-8 h-8 text-gray-400" />;
      case "Castle Builder": return <Castle className="w-8 h-8 text-gray-600" />;
      case "Cookie Clicker": return <Cookie className="w-8 h-8 text-yellow-700" />;
      case "Diner Dash": return <Croissant className="w-8 h-8 text-orange-600" />;
      case "Donut Drop": return <Donut className="w-8 h-8 text-pink-400" />;
      case "Egg Catch": return <Egg className="w-8 h-8 text-yellow-200" />;
      case "Gift Grab": return <Gift className="w-8 h-8 text-red-500" />;
      case "Cake Maker": return <Cake className="w-8 h-8 text-pink-300" />;
      case "Key Quest": return <Key className="w-8 h-8 text-yellow-500" />;
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
        <div className="grid grid-cols-3 gap-4">
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
                  <h3 className="font-semibold truncate text-sm">{game.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {game.liveMatches} Matches
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
    </div>
  );
}

    
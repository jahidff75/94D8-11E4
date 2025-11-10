'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tournaments } from "@/lib/data";
import CountdownTimer from "@/components/countdown-timer";
import { Badge } from "@/components/ui/badge";
import { Gem } from "lucide-react";
import BottomNav from "@/components/layout/bottom-nav";

export default function MyMatchesPage() {
  return (
    <div className="flex flex-col pb-24">
      <header className="p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold text-center">My Matches</h1>
      </header>

      <div className="p-4">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {tournaments.upcoming.map((match) => (
              <Card key={match.id} className="bg-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{match.gameName}</CardTitle>
                      <CardDescription>{match.matchTime}</CardDescription>
                    </div>
                     <Badge variant="secondary">Upcoming</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Map:</span>
                    <span>{match.map}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Entry Fee:</span>
                    <span className="font-semibold flex items-center gap-1"><Gem className="w-4 h-4 text-yellow-400" />{match.entryFee}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Prize Pool:</span>
                    <span className="font-semibold text-success flex items-center gap-1"><Gem className="w-4 h-4 text-yellow-400" />{match.prizePool}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <CountdownTimer targetDate={match.startsAt} />
                    <Button disabled variant="secondary" className="w-full">
                        Room Details
                    </Button>
                    <p className="text-xs text-muted-foreground">Unlocks 15 minutes before the match</p>
                </CardFooter>
              </Card>
            ))}
             {tournaments.upcoming.length === 0 && (
                <Card className="bg-card">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No upcoming matches.</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
          <TabsContent value="live" className="mt-4 space-y-4">
            {tournaments.live.map((match) => (
                <Card key={match.id} className="bg-card">
                     <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{match.gameName}</CardTitle>
                            <Badge className="bg-red-600 animate-pulse">Live</Badge>
                        </div>
                        <CardDescription>{match.matchTime}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">The match is currently in progress.</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Spectate</Button>
                    </CardFooter>
                </Card>
            ))}
             {tournaments.live.length === 0 && (
                <Card className="bg-card">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No live matches.</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
          <TabsContent value="completed" className="mt-4 space-y-4">
            {tournaments.completed.map((match) => (
              <Card key={match.id} className="bg-card">
                 <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                        <CardTitle>{match.gameName}</CardTitle>
                        <CardDescription>Match Completed</CardDescription>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center bg-secondary p-3 rounded-md">
                        <span className="text-muted-foreground">Your Rank</span>
                        <span className="font-bold text-lg">#{match.rank}</span>
                    </div>
                     <div className="flex justify-between items-center bg-secondary p-3 rounded-md">
                        <span className="text-muted-foreground">Kills</span>
                        <span className="font-bold text-lg">{match.kills}</span>
                    </div>
                     <div className="flex justify-between items-center bg-secondary p-3 rounded-md">
                        <span className="text-muted-foreground">Winnings</span>
                        <div className={`font-bold text-lg flex items-center gap-1 ${match.winnings > 0 ? 'text-success' : 'text-destructive'}`}>
                          <Gem className="w-4 h-4" />
                          <span>{match.winnings}</span>
                        </div>
                    </div>
                </CardContent>
              </Card>
            ))}
             {tournaments.completed.length === 0 && (
                <Card className="bg-card">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No completed matches.</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
}

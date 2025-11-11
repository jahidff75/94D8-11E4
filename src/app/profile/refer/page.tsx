'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Share2, Copy } from "lucide-react";
import BottomNav from "@/components/layout/bottom-nav";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const referredFriends = [
    { id: 1, name: 'Rohan Sharma', avatar: 'https://i.pravatar.cc/150?u=rohan', status: 'Joined', reward: 100 },
    { id: 2, name: 'Priya Singh', avatar: 'https://i.pravatar.cc/150?u=priya', status: 'Joined', reward: 100 },
    { id: 3, name: 'Amit Kumar', avatar: 'https://i.pravatar.cc/150?u=amit', status: 'Pending', reward: 0 },
];

export default function ReferAndEarnPage() {
    const { user } = useUser();
    const { toast } = useToast();

    const referralCode = user ? `SCA${user.uid.slice(0, 8).toUpperCase()}` : 'LOADING...';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        toast({
            title: "Copied!",
            description: "Referral code copied to clipboard.",
        });
    };
    
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join me on Sc Arena!',
                text: `I'm playing amazing games on Sc Arena. Join using my referral code ${referralCode} and get a joining bonus!`,
                url: window.location.href,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback for browsers that don't support navigator.share
            copyToClipboard();
            toast({
                title: "Sharing not supported",
                description: "Share feature is not available on your browser. Code copied instead.",
            });
        }
    };

  return (
    <div className="flex flex-col pb-24">
      <header className="p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold text-center">Refer & Earn</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Referral Code Section */}
        <Card className="bg-primary/10 border-primary text-center">
            <CardHeader>
                <CardTitle className="text-2xl">Invite Your Friends!</CardTitle>
                <CardDescription>Share your code and earn bonus coins when they join.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">Your Referral Code</p>
                <div 
                    className="flex items-center justify-center p-3 border-2 border-dashed border-primary rounded-lg bg-background cursor-pointer"
                    onClick={copyToClipboard}
                >
                    <span className="text-2xl font-bold tracking-widest text-primary">{referralCode}</span>
                    <Copy className="w-6 h-6 ml-4 text-muted-foreground"/>
                </div>
                <Button onClick={handleShare} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Your Code
                </Button>
            </CardContent>
        </Card>

        {/* How it works */}
        <Card>
            <CardHeader>
                <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
                    <p>Share your unique referral code with your friends.</p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">2</div>
                    <p>Your friend signs up using your code.</p>
                </div>
                <div className="flex items-start gap-4">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">3</div>
                    <p>You both receive <span className="font-bold text-success">100 Bonus Coins</span> instantly!</p>
                </div>
            </CardContent>
        </Card>

        {/* Referred Friends List */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Your Referrals</h2>
          <div className="space-y-3">
            {referredFriends.map((friend) => (
              <div key={friend.id} className="flex items-center p-3 bg-card rounded-lg">
                <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-medium">{friend.name}</p>
                </div>
                {friend.status === 'Joined' ? (
                     <Badge className="bg-success/20 text-success hover:bg-success/30">
                        + {friend.reward} Coins
                    </Badge>
                ) : (
                    <Badge variant="secondary">{friend.status}</Badge>
                )}
              </div>
            ))}
            {referredFriends.length === 0 && (
                <p className="text-center text-muted-foreground py-4">You haven't referred anyone yet.</p>
            )}
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  );
}

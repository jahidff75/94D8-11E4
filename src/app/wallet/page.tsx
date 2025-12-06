'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Gem, Gift, ChevronRight, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDoc, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import BottomNav from "@/components/layout/bottom-nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const topUpPackages = [
  { diamonds: 100, price: 80, bonus: 10, popular: false },
  { diamonds: 500, price: 400, bonus: 50, popular: true },
  { diamonds: 1200, price: 800, bonus: 150, popular: false },
  { diamonds: 2500, price: 1600, bonus: 350, popular: false },
  { diamonds: 5000, price: 3200, bonus: 800, popular: false },
];

export default function WalletPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const walletRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/wallet`, 'main');
  }, [firestore, user]);

  const { data: walletData, isLoading } = useDoc<any>(walletRef);
  
  const totalBalance = (walletData?.depositCash || 0) + (walletData?.winningsCash || 0) + (walletData?.bonusCash || 0);

  const handlePurchase = (diamonds: number) => {
    toast({
        title: "Purchase Successful!",
        description: `${diamonds} Diamonds have been added to your account.`,
        variant: 'default'
    });
  }
  
  const handleRedeem = () => {
    toast({
        title: "Redemption Request Sent!",
        description: `Your request for a Google Play redeem code is being processed.`,
        variant: 'default'
    });
  }

  return (
    <div className="flex flex-col pb-24">
      <header className="p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold text-center">My Wallet</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Balance Display */}
        <Card className="bg-primary/10 border-primary">
          <CardHeader>
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              <Gem className="w-8 h-8 text-yellow-400" />
              {isLoading ? '...' : totalBalance.toLocaleString()} Diamonds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deposit Diamonds:</span>
              <span>{isLoading ? '...' : (walletData?.depositCash || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Winnings Diamonds:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Only this amount is withdrawable/redeemable.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-success font-semibold">{isLoading ? '...' : (walletData?.winningsCash || 0).toLocaleString()}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Bonus Diamonds:</span>
              <span>{isLoading ? '...' : (walletData?.bonusCash || 0).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History Link */}
         <Link href="/wallet/history">
            <div className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                <span className="font-medium">Transaction History</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
        </Link>
        
        <Tabs defaultValue="purchase" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="purchase">Purchase Diamonds</TabsTrigger>
                <TabsTrigger value="redeem">Redeem Diamonds</TabsTrigger>
            </TabsList>
            <TabsContent value="purchase" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                    {topUpPackages.map((pkg) => (
                    <Card 
                        key={pkg.diamonds} 
                        className={cn(
                            "relative overflow-hidden cursor-pointer group hover:border-primary",
                            pkg.popular && "border-primary border-2"
                        )}
                        onClick={() => handlePurchase(pkg.diamonds)}
                    >
                        {pkg.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                            POPULAR
                        </div>
                        )}
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
                            <Gem className="w-10 h-10 text-yellow-400"/>
                            <p className="text-xl font-bold">{pkg.diamonds.toLocaleString()}</p>
                            {pkg.bonus > 0 && <p className="text-xs text-success">+ {pkg.bonus} Bonus</p>}
                            <Button variant={pkg.popular ? "default" : "secondary"} className="w-full mt-2">
                                ₹{pkg.price}
                            </Button>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="redeem" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Redeem for Google Play Code</CardTitle>
                        <CardDescription>
                            Convert your winning diamonds into Google Play redeem codes. 1 Diamond = ₹1.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="redeem-amount">Diamonds to Redeem</Label>
                            <Input id="redeem-amount" type="number" placeholder="e.g., 500" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            You can redeem a maximum of <span className="font-bold text-success">{(walletData?.winningsCash || 0).toLocaleString()}</span> winning diamonds.
                        </div>
                        <Button onClick={handleRedeem} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                           <Send className="mr-2 h-4 w-4" />
                            Request Redeem Code
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
}

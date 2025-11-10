'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions } from "@/lib/data";
import { Info, PlusCircle, MinusCircle, ArrowDown, ArrowUp, Gem, Ticket, Star, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDoc, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import BottomNav from "@/components/layout/bottom-nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const topUpPackages = [
  { coins: 100, price: 80, bonus: 10, popular: false },
  { coins: 500, price: 400, bonus: 50, popular: true },
  { coins: 1200, price: 800, bonus: 150, popular: false },
  { coins: 2500, price: 1600, bonus: 350, popular: false },
  { coins: 5000, price: 3200, bonus: 800, popular: false },
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

  const handlePurchase = (coins: number) => {
    // This is a placeholder for the actual payment gateway integration
    toast({
        title: "Purchase Successful!",
        description: `${coins} Coins have been added to your account.`,
        variant: 'default'
    });
  }

  return (
    <div className="flex flex-col pb-24">
      <header className="p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold text-center">Top-Up</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Balance Display */}
        <Card className="bg-primary/10 border-primary">
          <CardHeader>
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              <Gem className="w-8 h-8 text-yellow-400" />
              {isLoading ? '...' : totalBalance.toLocaleString()} Coins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deposit Coins:</span>
              <span>{isLoading ? '...' : (walletData?.depositCash || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Winnings Coins:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Only this amount is withdrawable.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-success font-semibold">{isLoading ? '...' : (walletData?.winningsCash || 0).toLocaleString()}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Bonus Coins:</span>
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
        

        {/* Top-Up Packages */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-center">Buy Coins</h2>
          <div className="grid grid-cols-2 gap-4">
            {topUpPackages.map((pkg) => (
              <Card 
                key={pkg.coins} 
                className={cn(
                    "relative overflow-hidden cursor-pointer group hover:border-primary",
                    pkg.popular && "border-primary border-2"
                )}
                onClick={() => handlePurchase(pkg.coins)}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center">
                    <Gem className="w-10 h-10 text-yellow-400"/>
                    <p className="text-xl font-bold">{pkg.coins.toLocaleString()}</p>
                    {pkg.bonus > 0 && <p className="text-xs text-success">+ {pkg.bonus} Bonus</p>}
                    <Button variant={pkg.popular ? "default" : "secondary"} className="w-full mt-2">
                        ₹{pkg.price}
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  );
}

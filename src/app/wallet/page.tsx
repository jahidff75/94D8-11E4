import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { user, transactions } from "@/lib/data";
import { Info, PlusCircle, MinusCircle, ArrowDown, ArrowUp, Gem } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export default function WalletPage() {
  return (
    <div className="flex flex-col">
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
              {user.totalBalance.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deposit Coins:</span>
              <span>{user.depositCash.toLocaleString()}</span>
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
              <span className="text-success font-semibold">{user.winningsCash.toLocaleString()}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Bonus Coins:</span>
              <span>{user.bonusCash.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="py-6 bg-success hover:bg-success/90 text-success-foreground text-lg font-bold">
            <ArrowDown className="mr-2 h-5 w-5" />
            ADD CASH
          </Button>
          <Button className="py-6 bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold">
             <ArrowUp className="mr-2 h-5 w-5" />
            WITHDRAW
          </Button>
        </div>

        {/* Transaction History */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id}>
                <div className="flex items-center p-2 rounded-lg">
                  <div className="p-2 bg-secondary rounded-full mr-4">
                    {tx.status === 'positive' ? (
                      <PlusCircle className="w-6 h-6 text-success" />
                    ) : (
                      <MinusCircle className="w-6 h-6 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className={`font-semibold flex items-center gap-1 ${tx.status === 'positive' ? 'text-success' : 'text-destructive'}`}>
                    <span>{tx.status === 'positive' ? '+' : '-'}</span>
                    <Gem className="w-4 h-4"/>
                    <span>{tx.amount}</span>
                  </div>
                </div>
                <Separator className="my-1"/>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

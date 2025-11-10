'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { transactions } from "@/lib/data";
import { PlusCircle, MinusCircle, Gem, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/layout/bottom-nav";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function TransactionHistoryPage() {
  return (
    <div className="flex flex-col pb-24">
      <header className="flex items-center p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Link href="/wallet" className="absolute left-4">
            <Button variant="ghost" size="icon">
                <ArrowLeft />
            </Button>
        </Link>
        <h1 className="text-xl font-bold text-center flex-1">Transaction History</h1>
      </header>

      <div className="p-4">
        {transactions.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="space-y-2">
                {transactions.map((tx, index) => (
                  <React.Fragment key={tx.id}>
                    <div className="flex items-center p-3">
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
                    {index < transactions.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No transactions yet.</p>
                </CardContent>
            </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

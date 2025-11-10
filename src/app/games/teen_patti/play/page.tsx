'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GamePlayPlaceholder() {
  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="flex items-center justify-between p-2 border-b border-gray-700">
        <Link href="/games/teen_patti" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Teen Patti</h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Teen Patti Game</h2>
          <p className="text-muted-foreground">The game will load here.</p>
           <div className="mt-8 p-8 border-2 border-dashed border-gray-600 rounded-lg">
             <p className="text-lg">Gameplay UI Placeholder</p>
           </div>
        </div>
      </main>
    </div>
  );
}

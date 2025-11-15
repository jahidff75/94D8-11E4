'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInAnonymously, 
  getAdditionalUserInfo 
} from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleAuthError = (e: any) => {
    switch (e.code) {
      case 'auth/operation-not-allowed':
        setError('Sign-in method not enabled. Please enable it in your Firebase Console (Authentication > Sign-in method).');
        break;
      case 'auth/unauthorized-domain':
        setError('This domain is not authorized. Please add "localhost" to the authorized domains in your Firebase Console (Authentication > Settings).');
        break;
      case 'auth/user-not-found':
        setError('No account found with this email. Please sign up.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again.');
        break;
      case 'auth/email-already-in-use':
        setError('This email is already in use. Please log in.');
        break;
      default:
        setError(e.message);
        break;
    }
  };
  
  const createNewUserDocuments = (user: User) => {
    if (!firestore) return;

    // Create the user profile document
    const userRef = doc(firestore, 'users', user.uid);
    setDocumentNonBlocking(userRef, {
      id: user.uid,
      username: username || user.displayName || user.email?.split('@')[0],
      email: user.email,
      profilePhotoUrl: user.photoURL || '',
      matchesPlayed: 0,
      matchesWon: 0,
      winRate: 0,
      totalWinnings: 0,
    }, { merge: true });

    // Create the user's wallet document in a sub-collection
    const walletRef = doc(firestore, `users/${user.uid}/wallet`, 'main');
    setDocumentNonBlocking(walletRef, {
      userId: user.uid,
      depositCash: 0,
      winningsCash: 0,
      bonusCash: 100, // Giving 100 bonus coins on signup
      totalBalance: 100,
    }, { merge: true });
  }

  const handleSignUp = async () => {
    setError(null);
    if (!auth || !firestore) return;
    if (!username) {
        setError("Please enter a username.");
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createNewUserDocuments(userCredential.user);
      // Let the useEffect handle redirection
    } catch (e: any) {
      handleAuthError(e);
    }
  };

  const handleLogin = async () => {
    setError(null);
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let the useEffect handle redirection
    } catch (e: any) {
      handleAuthError(e);
    }
  };

  const handleAnonymousLogin = async () => {
    setError(null);
    if (!auth) return;
    try {
      const userCredential = await signInAnonymously(auth);
      // For anonymous users, we might still want to create basic documents
      createNewUserDocuments(userCredential.user);
      // Let the useEffect handle redirection
    } catch(e: any) {
      handleAuthError(e);
    }
  };
  
  if (isUserLoading || user) {
    return <div className="flex h-dvh items-center justify-center">Loading...</div>;
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sc Arena</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button onClick={handleLogin} className="w-full">Login</Button>
                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>
                <Button onClick={handleAnonymousLogin} variant="secondary" className="w-full">Guest Login</Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="signup-username">Username</Label>
                        <Input id="signup-username" type="text" placeholder="@username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    <Button onClick={handleSignUp} className="w-full">Sign Up</Button>
                </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';
import Image from "next/image";
import { user as staticUser } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  LogOut,
  User as UserIcon,
  History,
  Users,
  MessageCircleQuestion,
  Shield,
  FileText,
  Gem,
} from "lucide-react";
import Link from "next/link";
import { useUser, useDoc, useAuth, useFirestore, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";

const menuItems = [
  {
    icon: UserIcon,
    label: "Account Settings",
    href: "/profile/settings",
  },
  {
    icon: History,
    label: "Match History",
    href: "/profile/history",
  },
  {
    icon: Users,
    label: "Refer & Earn",
    href: "/profile/refer",
  },
  {
    icon: MessageCircleQuestion,
    label: "Customer Support & FAQ",
    href: "/profile/support",
  },
  {
    icon: Shield,
    label: "Privacy Policy",
    href: "/profile/privacy",
  },
  {
    icon: FileText,
    label: "Terms & Conditions",
    href: "/profile/terms",
  },
];

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const userRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userData, isLoading: isUserDocLoading } = useDoc<any>(userRef);

  const profileImage = PlaceHolderImages.find(
    (img) => img.id === staticUser.profileImageId
  );
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  }

  if (isUserLoading || isUserDocLoading) {
    return <div className="flex items-center justify-center h-dvh">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  const userInitial = userData?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex flex-col pb-24">
       <header className="p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold text-center">My Profile</h1>
      </header>

      <div className="p-4 space-y-8">
        {/* User Info Section */}
        <section className="flex flex-col items-center gap-2">
          <Avatar className="w-24 h-24 border-2 border-primary">
            <AvatarImage src={user.isAnonymous ? '' : (profileImage?.imageUrl || '')} alt={userData?.username} data-ai-hint={profileImage?.imageHint}/>
            <AvatarFallback className="text-3xl bg-muted">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{user.isAnonymous ? 'Guest Player' : (userData?.username || user.email)}</h2>
          <p className="text-muted-foreground">{user.isAnonymous ? `@guest_${user.uid.slice(0,6)}` : (userData?.username ? `@${userData.username}` : user.uid)}</p>
        </section>

        {/* Stats Dashboard */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData?.matchesPlayed || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Matches Won</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{userData?.matchesWon || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData?.winRate || '0%'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Gem className="w-5 h-5 text-yellow-400" />
                  <span>{(userData?.totalWinnings || 0).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Menu List */}
        <section>
            <div className="flex flex-col gap-2">
                {menuItems.map(item => (
                    <Link href={item.href} key={item.label}>
                        <div className="flex items-center p-3 bg-card rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                            <item.icon className="w-5 h-5 mr-4 text-muted-foreground" />
                            <span className="flex-1 font-medium">{item.label}</span>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        {/* Logout Button */}
        <section>
            <Button onClick={handleLogout} variant="destructive" className="w-full bg-red-800/80 hover:bg-red-800 text-white">
                <LogOut className="mr-2 h-4 w-4" />
                LOGOUT
            </Button>
        </section>
      </div>
       <BottomNav />
    </div>
  );
}

import Image from "next/image";
import { user } from "@/lib/data";
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
  const profileImage = PlaceHolderImages.find(
    (img) => img.id === user.profileImageId
  );
  const userInitial = user.name.charAt(0);

  return (
    <div className="flex flex-col">
       <header className="p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold text-center">My Profile</h1>
      </header>

      <div className="p-4 space-y-8">
        {/* User Info Section */}
        <section className="flex flex-col items-center gap-2">
          <Avatar className="w-24 h-24 border-2 border-primary">
            <AvatarImage src={profileImage?.imageUrl} alt={user.name} data-ai-hint={profileImage?.imageHint}/>
            <AvatarFallback className="text-3xl bg-muted">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.username}</p>
        </section>

        {/* Stats Dashboard */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.matchesPlayed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Matches Won</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{user.stats.matchesWon}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.winRate}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Gem className="w-5 h-5 text-yellow-400" />
                  <span>{user.stats.totalWinnings.toLocaleString()}</span>
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
            <Button variant="destructive" className="w-full bg-red-800/80 hover:bg-red-800 text-white">
                <LogOut className="mr-2 h-4 w-4" />
                LOGOUT
            </Button>
        </section>
      </div>
    </div>
  );
}

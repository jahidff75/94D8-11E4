export const user = {
  name: "Jahidul SK",
  username: "@jahidul_pro_gamer",
  profileImageId: "user_profile_1",
  totalBalance: 63000,
  depositCash: 10000,
  winningsCash: 50000,
  bonusCash: 3000,
  stats: {
    matchesPlayed: 152,
    matchesWon: 48,
    winRate: "31%",
    totalWinnings: 1250000,
  },
};

export const allGames = [
  { id: "ludo", name: "Ludo King", liveMatches: 12, category: 'winzomania' },
  { id: "carrom", name: "Carrom", liveMatches: 3, category: 'winzomania' },
  { id: "snl", name: "Snake & Ladder", liveMatches: 2, category: 'winzomania' },
  { id: "fruit", name: "Fruit Samurai", liveMatches: 18, category: 'winzomania' },
  { id: "bubble_shooter", name: "Bubble Shooter", liveMatches: 30, category: 'winzomania' },
  { id: "block_puzzle", name: "Block Puzzle", liveMatches: 28, category: 'winzomania' },
  { id: "candy", name: "Candy Crush", liveMatches: 35, category: 'winzomania' },
  { id: "solitaire", name: "Solitaire", liveMatches: 9, category: 'winzomania' },
  
  { id: "ship_wars", name: "Ship Wars", liveMatches: 2, category: 'world_war' },
  { id: "tank", name: "Tank Battle", liveMatches: 3, category: 'world_war' },
  { id: "racing", name: "Racing Clash", liveMatches: 9, category: 'world_war' },
  { id: "street_racer", name: "Street Racer", liveMatches: 8, category: 'world_war' },
  { id: "space_hunter", name: "Space Hunter", liveMatches: 13, category: 'world_war' },
  { id: "plane", name: "Plane Mayhem", liveMatches: 5, category: 'world_war' },
  { id: "zombie", name: "Zombie Smash", liveMatches: 17, category: 'world_war' },
  { id: "jungle_run", name: "Jungle Run", liveMatches: 16, category: 'world_war' },
  { id: "mine_runner", name: "Mine Runner", liveMatches: 10, category: 'world_war' },

  { id: "poker", name: "Poker", liveMatches: 15, category: 'tournament' },
  { id: "rummy", name: "Rummy", liveMatches: 20, category: 'tournament' },
  { id: "pool", name: "8 Ball Pool", liveMatches: 10, category: 'tournament' },
  { id: "teen_patti", name: "Teen Patti", liveMatches: 25, category: 'tournament' },
  { id: "call_break", name: "Call Break", liveMatches: 14, category: 'tournament' },
  { id: "chess", name: "Chess", liveMatches: 6, category: 'tournament' },
  { id: "archery", name: "Archery King", liveMatches: 7, category: 'tournament' },
  { id: "air_hockey", name: "Air Hockey", liveMatches: 4, category: 'tournament' },
  { id: "knife_up", name: "Knife Up", liveMatches: 22, category: 'tournament' },
  { id: "fish", name: "Fish Frenzy", liveMatches: 21, category: 'tournament' },
];

export const gameCategories = [
  {
    id: 'winzomania',
    title: 'WINZOMANIA',
    games: allGames.filter(g => g.category === 'winzomania'),
    banners: ['banner_ludo']
  },
  {
    id: 'world_war',
    title: 'WORLD WAR',
    games: allGames.filter(g => g.category === 'world_war'),
    banners: ['banner_offer']
  },
  {
    id: 'tournament',
    title: 'TOURNAMENT',
    games: allGames.filter(g => g.category === 'tournament'),
    banners: ['banner_rummy']
  }
];

export const games = allGames; // Keep original export for other parts of the app if needed

export const offers = [
  {
    id: "offer1",
    title: "Play Rummy & Win Lakhs",
    description: "Download the app and get a bonus.",
    buttonText: "Download & Get 200 Bonus Coins",
    imageId: "offer_rummy",
  },
];

const getFutureDate = (hours: number, minutes: number) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
}

export const tournaments = {
  upcoming: [
  ],
  live: [
    {
      id: "t3",
      gameName: "Ludo King",
      matchTime: "Live Now",
    },
  ],
  completed: [
    {
      id: "t5",
      gameName: "Carrom",
      rank: 2,
      kills: 0,
      winnings: 0,
    },
  ],
};

export const transactions = [
    { id: 'tx1', type: 'deposit', title: 'Coins Added via UPI (+100 Bonus)', amount: 1100, date: '10 Nov, 02:30 PM', status: 'positive' },
    { id: 'tx2', type: 'win', title: 'Won from Free Fire Match', amount: 2500, date: '10 Nov, 01:00 PM', status: 'positive' },
    { id: 'tx3', type: 'join', title: 'Joined Ludo Match', amount: 200, date: '09 Nov, 08:00 PM', status: 'negative' },
    { id: 'tx4', type: 'withdrawal', title: 'Withdrawal to Bank', amount: 5000, date: '09 Nov, 07:30 PM', status: 'negative' },
    { id: 'tx5', type: 'deposit', title: 'Coins Added via Card', amount: 2000, date: '08 Nov, 11:00 AM', status: 'positive' },
];

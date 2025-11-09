export const user = {
  name: "Jahidul SK",
  username: "@jahidul_pro_gamer",
  profileImageId: "user_profile_1",
  totalBalance: 600,
  depositCash: 100,
  winningsCash: 500,
  stats: {
    matchesPlayed: 152,
    matchesWon: 48,
    winRate: "31%",
    totalWinnings: 12500,
  },
};

export const featuredBanners = [
  {
    id: "banner1",
    title: "Mega Free Fire Tournament",
    desc: "Win from a prize pool of ₹1,00,000!",
    buttonText: "Join Now",
    imageId: "banner_freefire",
  },
  {
    id: "banner2",
    title: "New Game: Ludo King",
    desc: "Play the classic board game and win big!",
    buttonText: "Play Now",
    imageId: "banner_ludo",
  },
  {
    id: "banner3",
    title: "Special Offer",
    desc: "Add ₹100 & Get ₹20 Extra!",
    buttonText: "Add Cash",
    imageId: "banner_offer",
  },
];

export const games = [
  { id: "game_ff", name: "Free Fire", liveMatches: 5 },
  { id: "game_bgmi", name: "BGMI", liveMatches: 8 },
  { id: "game_ludo", name: "Ludo King", liveMatches: 12 },
  { id: "game_carrom", name: "Carrom", liveMatches: 3 },
  { id: "game_snl", name: "Snake & Ladder", liveMatches: 2 },
  { id: "game_rummy", name: "Rummy", liveMatches: 20 },
  { id: "game_metro", name: "Metro Surface", liveMatches: 4 },
];

export const offers = [
  {
    id: "offer1",
    title: "Play Rummy & Win Lakhs",
    description: "Download the app and get a bonus.",
    buttonText: "Download & Get ₹50",
    imageId: "offer_rummy",
  },
  {
    id: "offer2",
    title: "Fantasy Cricket",
    description: "Create your team and win.",
    buttonText: "Play & Win ₹25",
    imageId: "offer_fantasy",
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
    {
      id: "t1",
      gameName: "Free Fire",
      matchTime: "Today, 8:00 PM",
      map: "Bermuda",
      entryFee: 50,
      prizePool: 5000,
      startsAt: getFutureDate(2, 15),
    },
    {
      id: "t2",
      gameName: "BGMI",
      matchTime: "Today, 9:00 PM",
      map: "Erangel",
      entryFee: 100,
      prizePool: 10000,
      startsAt: getFutureDate(3, 15),
    },
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
      id: "t4",
      gameName: "Free Fire",
      rank: 5,
      kills: 8,
      winnings: 250,
    },
    {
      id: "t5",
      gameName: "Carrom",
      rank: 2,
      kills: 0,
      winnings: 0,
    },
     {
      id: "t6",
      gameName: "BGMI",
      rank: 1,
      kills: 12,
      winnings: 1500,
    },
  ],
};

export const transactions = [
    { id: 'tx1', type: 'deposit', title: 'Money Added via UPI', amount: 100, date: '10 Nov, 02:30 PM', status: 'positive' },
    { id: 'tx2', type: 'win', title: 'Won from Free Fire Match', amount: 250, date: '10 Nov, 01:00 PM', status: 'positive' },
    { id: 'tx3', type: 'join', title: 'Joined Ludo Match', amount: 20, date: '09 Nov, 08:00 PM', status: 'negative' },
    { id: 'tx4', type: 'withdrawal', title: 'Withdrawal to Bank', amount: 500, date: '09 Nov, 07:30 PM', status: 'negative' },
    { id: 'tx5', type: 'deposit', title: 'Money Added via Card', amount: 200, date: '08 Nov, 11:00 AM', status: 'positive' },
];

// Sample content for enriching language cards with country info
export const languageCountryInfo: Record<
  string,
  { country: string; description: string; learners: string }
> = {
  ja: {
    country: "Japan",
    description: "Master kanji, hiragana, and katakana",
    learners: "14.2M",
  },
  es: {
    country: "Spain / Latin America",
    description: "The world's second most spoken language",
    learners: "71.5M",
  },
  fr: {
    country: "France",
    description: "The language of art, cuisine, and diplomacy",
    learners: "32.6M",
  },
  de: {
    country: "Germany",
    description: "Precise, poetic, and powerfully expressive",
    learners: "16.8M",
  },
  zh: {
    country: "China",
    description: "Unlock the world's largest economy",
    learners: "47.3M",
  },
  ko: {
    country: "South Korea",
    description: "K-pop, K-drama, and beyond",
    learners: "18.4M",
  },
  pt: {
    country: "Brazil / Portugal",
    description: "Spoken across four continents",
    learners: "12.9M",
  },
  it: {
    country: "Italy",
    description: "Opera, fashion, and la dolce vita",
    learners: "9.1M",
  },
  ar: {
    country: "Middle East & North Africa",
    description: "An ancient script with modern reach",
    learners: "7.4M",
  },
  ru: {
    country: "Russia",
    description: "Unlock the world's largest nation",
    learners: "10.2M",
  },
  hi: {
    country: "India",
    description: "Spoken by over 600 million people",
    learners: "19.7M",
  },
  tr: {
    country: "Turkey",
    description: "A bridge between East and West",
    learners: "4.8M",
  },
  nl: {
    country: "Netherlands",
    description: "Direct, precise, and closely related to English",
    learners: "3.2M",
  },
  sv: {
    country: "Sweden",
    description: "Gateway to Scandinavian culture",
    learners: "2.5M",
  },
};

// Category icon mapping
export const categoryIcons: Record<string, string> = {
  Basics: "📚",
  Numbers: "🔢",
  Food: "🍜",
  Travel: "✈️",
  Greetings: "👋",
  Colors: "🎨",
  Animals: "🦁",
  Family: "👨‍👩‍👧‍👦",
  Weather: "🌤️",
  Time: "⏰",
  Shopping: "🛍️",
  Health: "🏥",
  Sports: "⚽",
  Music: "🎵",
  Technology: "💻",
};

// Badge metadata
export const badgeInfo: Record<string, { icon: string; label: string }> = {
  first_lesson: { icon: "🌱", label: "First Steps" },
  streak_7: { icon: "🔥", label: "Week Warrior" },
  streak_30: { icon: "⚡", label: "Month Master" },
  perfect_quiz: { icon: "💯", label: "Perfect Score" },
  xp_100: { icon: "⭐", label: "Rising Star" },
  xp_500: { icon: "🌟", label: "Shining Star" },
  xp_1000: { icon: "🏆", label: "Legend" },
  multilingual: { icon: "🌍", label: "Multilingual" },
};

// Leaderboard sample data (shown when backend returns empty)
export const sampleLeaderboard = [
  { username: "PolyglotPete", points: BigInt(4820) },
  { username: "LingoLisa", points: BigInt(3940) },
  { username: "VocabVictor", points: BigInt(3210) },
  { username: "FluentFiona", points: BigInt(2850) },
  { username: "WordWizard99", points: BigInt(2340) },
  { username: "BabelBob", points: BigInt(1980) },
  { username: "NativeSpeaker42", points: BigInt(1640) },
  { username: "DailyLearner", points: BigInt(1200) },
  { username: "LanguageLover", points: BigInt(890) },
  { username: "NewcomerNick", points: BigInt(340) },
];

// Rank medal helper
export function getRankDisplay(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

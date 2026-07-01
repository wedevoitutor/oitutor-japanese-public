/**
 * Placeholder badges — collectible, visually distinct by rarity.
 * Icons use react-icons/fa names (import as needed in components).
 */
export const BADGES = [
  // Bronze
  { id: 'first-login',       name: 'Welcome',           description: 'Logged in for the first time',       icon: 'FaDoorOpen',     rarity: 'bronze', unlocked: false },
  { id: 'first-lesson',      name: 'Beginner',          description: 'Completed your first lesson',        icon: 'FaSeedling',     rarity: 'bronze', unlocked: false },
  { id: 'explorer',          name: 'Explorer',          description: 'Visited every section',               icon: 'FaCompass',      rarity: 'bronze', unlocked: false },
  { id: 'quick-learner',     name: 'Quick Learner',     description: 'Completed 3 lessons in one day',     icon: 'FaBolt',         rarity: 'bronze', unlocked: false },

  // Silver
  { id: 'kana-master',       name: 'Kana Master',       description: 'Completed all hiragana & katakana',  icon: 'FaScroll',       rarity: 'silver', unlocked: false },
  { id: 'vocab-builder',     name: 'Vocab Builder',     description: 'Learned 100 vocabulary words',       icon: 'FaBook',         rarity: 'silver', unlocked: false },
  { id: 'streak-warrior',    name: 'Streak Warrior',    description: 'Maintained a 14-day streak',         icon: 'FaFire',         rarity: 'silver', unlocked: false },
  { id: 'practice-pro',      name: 'Practice Pro',      description: 'Completed 20 practice sessions',     icon: 'FaDumbbell',     rarity: 'silver', unlocked: false },
  { id: 'night-owl',         name: 'Night Owl',         description: 'Studied after midnight',             icon: 'FaMoon',         rarity: 'silver', unlocked: false },

  // Gold
  { id: 'kanji-conqueror',   name: 'Kanji Conqueror',   description: 'Mastered all N5 kanji',              icon: 'FaTrophy',       rarity: 'gold',   unlocked: false },
  { id: 'grammar-guru',      name: 'Grammar Guru',      description: 'Completed all 20 grammar lessons',   icon: 'FaGraduationCap',rarity: 'gold',   unlocked: false },
  { id: 'fluency-path',      name: 'Fluency Path',      description: 'Completed all dialogue lessons',     icon: 'FaRoad',         rarity: 'gold',   unlocked: false },

  // Platinum
  { id: 'completionist',     name: 'Completionist',     description: 'Completed every lesson in the app',  icon: 'FaGem',          rarity: 'platinum', unlocked: false },
  { id: 'sensei',            name: 'Sensei',            description: 'Reached level 50',                   icon: 'FaUserNinja',    rarity: 'platinum', unlocked: false },
  { id: 'legend',            name: 'Legend',            description: 'Earned 10,000 total XP',             icon: 'FaDragon',       rarity: 'platinum', unlocked: false },
];

export const RARITY_COLORS = {
  bronze:   { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300' },
  silver:   { bg: 'bg-slate-100',  text: 'text-slate-600',  border: 'border-slate-300' },
  gold:     { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-400' },
  platinum: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
};

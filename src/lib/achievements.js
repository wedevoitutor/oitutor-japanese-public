/**
 * Placeholder achievements — easy to extend.
 * Icons use react-icons/fa names (import as needed in components).
 */
export const ACHIEVEMENTS = [
  { id: 'first-steps',     title: 'First Steps',       description: 'Complete your first lesson',             icon: 'FaShoePrints',   xpReward: 10,  category: 'progress',  unlocked: false, dateUnlocked: null },
  { id: 'hiragana-hero',   title: 'Hiragana Hero',     description: 'Complete all hiragana lessons',          icon: 'FaLanguage',     xpReward: 50,  category: 'mastery',   unlocked: false, dateUnlocked: null },
  { id: 'katakana-knight', title: 'Katakana Knight',   description: 'Complete all katakana lessons',          icon: 'FaShieldAlt',    xpReward: 50,  category: 'mastery',   unlocked: false, dateUnlocked: null },
  { id: 'streak-3',        title: 'On a Roll',         description: 'Reach a 3-day streak',                  icon: 'FaFire',         xpReward: 15,  category: 'streak',    unlocked: false, dateUnlocked: null },
  { id: 'streak-7',        title: 'Streak Champion',   description: 'Reach a 7-day streak',                  icon: 'FaFireAlt',      xpReward: 30,  category: 'streak',    unlocked: false, dateUnlocked: null },
  { id: 'streak-30',       title: 'Streak Legend',     description: 'Reach a 30-day streak',                 icon: 'FaMedal',        xpReward: 100, category: 'streak',    unlocked: false, dateUnlocked: null },
  { id: 'grammar-sensei',  title: 'Grammar Sensei',    description: 'Complete 10 grammar lessons',           icon: 'FaBookOpen',     xpReward: 40,  category: 'mastery',   unlocked: false, dateUnlocked: null },
  { id: 'dialogue-master', title: 'Dialogue Master',   description: 'Complete 10 dialogue lessons',          icon: 'FaComments',     xpReward: 40,  category: 'mastery',   unlocked: false, dateUnlocked: null },
  { id: 'xp-500',          title: 'Rising Star',       description: 'Earn 500 total XP',                     icon: 'FaStar',         xpReward: 20,  category: 'progress',  unlocked: false, dateUnlocked: null },
  { id: 'xp-2000',         title: 'XP Master',         description: 'Earn 2000 total XP',                    icon: 'FaCrown',        xpReward: 50,  category: 'progress',  unlocked: false, dateUnlocked: null },
  { id: 'perfect-score',   title: 'Perfectionist',     description: 'Get a perfect score on any lesson',     icon: 'FaBullseye',     xpReward: 25,  category: 'skill',     unlocked: false, dateUnlocked: null },
  { id: 'kanji-starter',   title: 'Kanji Apprentice',  description: 'Complete your first kanji batch',       icon: 'FaPenFancy',     xpReward: 30,  category: 'mastery',   unlocked: false, dateUnlocked: null },
];

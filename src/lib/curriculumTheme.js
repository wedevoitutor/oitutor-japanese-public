// Colour themes mirror the SkillTree paths so each section keeps a stable identity
// across the curriculum page and the skill tree. Each theme provides tokens for
// the page chrome, nav, plaque header, lesson cards, and buttons — single source
// of truth for all curriculum-page colour decisions.
const THEMES = {
  alphabets: {
    titleJp: 'text-rose-700',
    navActive: 'bg-rose-100 text-rose-950 ring-1 ring-rose-200',
    progress: 'bg-rose-600',
    gradient: 'from-rose-500 to-red-700',
    pageBg: 'bg-gradient-to-b from-rose-50/60 via-white to-white',
    watermarkColor: 'text-rose-900/[.05]',
    watermarkKanji: ['あ', 'ア'],
    cardBg: 'bg-rose-50/40',
    cardBorder: 'border-rose-200/70',
    cardHover: 'hover:border-rose-400 hover:shadow-rose-200/50',
    typeLabel: 'text-rose-700',
    cta: 'bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-sm hover:shadow-md hover:shadow-rose-500/30',
    ctaCompleted: 'bg-rose-100 text-rose-900 hover:bg-rose-200 ring-1 ring-rose-200/60',
    ctaLocked: 'border-rose-200 text-rose-700 hover:bg-rose-50',
    accent: 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 hover:shadow-lg hover:shadow-rose-600/40',
  },
  kanji: {
    titleJp: 'text-indigo-700',
    navActive: 'bg-indigo-100 text-indigo-950 ring-1 ring-indigo-200',
    progress: 'bg-indigo-600',
    gradient: 'from-indigo-500 to-blue-700',
    pageBg: 'bg-gradient-to-b from-indigo-50/60 via-white to-white',
    watermarkColor: 'text-indigo-900/[.05]',
    watermarkKanji: ['漢', '字'],
    cardBg: 'bg-indigo-50/40',
    cardBorder: 'border-indigo-200/70',
    cardHover: 'hover:border-indigo-400 hover:shadow-indigo-200/50',
    typeLabel: 'text-indigo-700',
    cta: 'bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-sm hover:shadow-md hover:shadow-indigo-500/30',
    ctaCompleted: 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200 ring-1 ring-indigo-200/60',
    ctaLocked: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50',
    accent: 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 hover:shadow-lg hover:shadow-indigo-600/40',
  },
  lessons: {
    titleJp: 'text-teal-700',
    navActive: 'bg-teal-100 text-teal-950 ring-1 ring-teal-200',
    progress: 'bg-teal-600',
    gradient: 'from-teal-500 to-emerald-700',
    pageBg: 'bg-gradient-to-b from-teal-50/60 via-white to-white',
    watermarkColor: 'text-teal-900/[.05]',
    watermarkKanji: ['会', '話'],
    cardBg: 'bg-teal-50/40',
    cardBorder: 'border-teal-200/70',
    cardHover: 'hover:border-teal-400 hover:shadow-teal-200/50',
    typeLabel: 'text-teal-700',
    cta: 'bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-sm hover:shadow-md hover:shadow-teal-500/30',
    ctaCompleted: 'bg-teal-100 text-teal-900 hover:bg-teal-200 ring-1 ring-teal-200/60',
    ctaLocked: 'border-teal-200 text-teal-700 hover:bg-teal-50',
    accent: 'bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/30 hover:shadow-lg hover:shadow-teal-600/40',
  },
  grammar: {
    titleJp: 'text-violet-700',
    navActive: 'bg-violet-100 text-violet-950 ring-1 ring-violet-200',
    progress: 'bg-violet-600',
    gradient: 'from-violet-500 to-purple-700',
    pageBg: 'bg-gradient-to-b from-violet-50/60 via-white to-white',
    watermarkColor: 'text-violet-900/[.05]',
    watermarkKanji: ['文', '法'],
    cardBg: 'bg-violet-50/40',
    cardBorder: 'border-violet-200/70',
    cardHover: 'hover:border-violet-400 hover:shadow-violet-200/50',
    typeLabel: 'text-violet-700',
    cta: 'bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-sm hover:shadow-md hover:shadow-violet-500/30',
    ctaCompleted: 'bg-violet-100 text-violet-900 hover:bg-violet-200 ring-1 ring-violet-200/60',
    ctaLocked: 'border-violet-200 text-violet-700 hover:bg-violet-50',
    accent: 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-600/30 hover:shadow-lg hover:shadow-violet-600/40',
  },
};

const SECTION_TO_THEME = {
  hiragana: 'alphabets',
  katakana: 'alphabets',
  kanji: 'kanji',
  dialogues: 'lessons',
  grammar: 'grammar',
};

export function getSectionTheme(sectionId) {
  return THEMES[SECTION_TO_THEME[sectionId]] ?? THEMES.alphabets;
}

import sectionsData from '../../content/sections.json';
import { AVAILABLE_CONTENT_FILES } from '../../lib/contentLoader';

export const PROGRESS_THEME = {
  alphabets: {
    gradient: 'from-rose-500 to-red-700',
    current: 'border-[#ffd6e7] bg-gradient-to-br from-rose-300 via-pink-400 to-rose-600 text-white ring-2 ring-rose-200/90 shadow-[0_14px_34px_rgba(244,114,182,0.48),inset_0_2px_8px_rgba(255,255,255,0.35)]',
    glow: 'shadow-rose-500/40',
  },
  kanji: {
    gradient: 'from-indigo-500 to-blue-700',
    current: 'border-indigo-200 bg-gradient-to-br from-indigo-500 to-blue-700 text-white ring-2 ring-indigo-200/90 shadow-[0_14px_34px_rgba(99,102,241,0.48),inset_0_2px_8px_rgba(255,255,255,0.28)]',
    glow: 'shadow-indigo-500/40',
  },
  lessons: {
    gradient: 'from-teal-500 to-emerald-700',
    current: 'border-teal-200 bg-gradient-to-br from-teal-500 to-emerald-700 text-white ring-2 ring-teal-200/90 shadow-[0_14px_34px_rgba(20,184,166,0.48),inset_0_2px_8px_rgba(255,255,255,0.28)]',
    glow: 'shadow-teal-500/40',
  },
  grammar: {
    gradient: 'from-violet-500 to-purple-700',
    current: 'border-violet-200 bg-gradient-to-br from-violet-500 to-purple-700 text-white ring-2 ring-violet-200/90 shadow-[0_14px_34px_rgba(139,92,246,0.50),inset_0_2px_8px_rgba(255,255,255,0.28)]',
    glow: 'shadow-violet-500/40',
  },
};

const JAPANESE_NUMERALS = [
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
  '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十',
  '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九',
];

const KANJI_BATCH_LABELS = [
  '日', '十', '三', '上', '学', '下', '女', '千', '木',
  '火', '北', '耳', '外', '食', '書', '行', '復', '新',
];

export const kanjiPathPositions = [
  { id: 1, x: 50, y: 8 },
  { id: 2, x: 36, y: 13 },
  { id: 3, x: 64, y: 18 },
  { id: 4, x: 43, y: 23 },
  { id: 5, x: 58, y: 28 },
  { id: 6, x: 34, y: 34 },
  { id: 7, x: 66, y: 39 },
  { id: 8, x: 48, y: 44 },
  { id: 9, x: 31, y: 50 },
  { id: 10, x: 69, y: 55 },
  { id: 11, x: 45, y: 60 },
  { id: 12, x: 57, y: 65 },
  { id: 13, x: 34, y: 71 },
  { id: 14, x: 66, y: 76 },
  { id: 15, x: 48, y: 81 },
  { id: 16, x: 37, y: 87 },
  { id: 17, x: 63, y: 91 },
  { id: 18, x: 50, y: 95 },
];

export const lessonsPathPositions = [
  { id: 1, x: 50, y: 5.5 },
  { id: 2, x: 38, y: 8 },
  { id: 3, x: 62, y: 9.8 },
  { id: 4, x: 45, y: 12.4 },
  { id: 5, x: 70, y: 14.2 },
  { id: 6, x: 31, y: 16.5 },
  { id: 7, x: 55, y: 18.6 },
  { id: 8, x: 74, y: 20.8 },
  { id: 9, x: 41, y: 22.6 },
  { id: 10, x: 25, y: 25 },
  { id: 11, x: 59, y: 26.8 },
  { id: 12, x: 78, y: 29 },
  { id: 13, x: 47, y: 31 },
  { id: 14, x: 30, y: 33.4 },
  { id: 15, x: 66, y: 35.2 },
  { id: 16, x: 52, y: 37.6 },
  { id: 17, x: 77, y: 39.5 },
  { id: 18, x: 34, y: 41.8 },
  { id: 19, x: 58, y: 43.8 },
  { id: 20, x: 24, y: 46.2 },
  { id: 21, x: 69, y: 48 },
  { id: 22, x: 43, y: 50.4 },
  { id: 23, x: 78, y: 52.2 },
  { id: 24, x: 31, y: 54.6 },
  { id: 25, x: 55, y: 56.6 },
  { id: 26, x: 72, y: 58.8 },
  { id: 27, x: 39, y: 60.8 },
  { id: 28, x: 21, y: 63.1 },
  { id: 29, x: 61, y: 65 },
  { id: 30, x: 80, y: 67.2 },
  { id: 31, x: 48, y: 69.2 },
  { id: 32, x: 29, y: 71.5 },
  { id: 33, x: 68, y: 73.4 },
  { id: 34, x: 53, y: 75.7 },
  { id: 35, x: 78, y: 77.6 },
  { id: 36, x: 36, y: 79.8 },
  { id: 37, x: 59, y: 81.7 },
  { id: 38, x: 23, y: 84 },
  { id: 39, x: 71, y: 85.7 },
  { id: 40, x: 43, y: 87.9 },
  { id: 41, x: 82, y: 89.3 },
  { id: 42, x: 31, y: 91 },
  { id: 43, x: 55, y: 92.1 },
  { id: 44, x: 70, y: 93.2 },
  { id: 45, x: 22, y: 94.1 },
  { id: 46, x: 42, y: 95 },
  { id: 47, x: 59, y: 95.8 },
  { id: 48, x: 76, y: 96.5 },
  { id: 49, x: 50, y: 97.3 },
];

export const lessonsMobileChapters = [
  {
    id: 'path-1',
    labelKey: 'skillTree.lessons.chapters.pathOneLabel',
    titleKey: 'skillTree.lessons.chapters.pathOneTitle',
    lessonRange: [1, 15],
    backgroundPosition: 'top center',
    nodes: [
      { lessonNumber: 1, x: 50, y: 7, labelX: 66, labelY: 8.6 },
      { lessonNumber: 2, x: 42, y: 13.2 },
      { lessonNumber: 3, x: 58, y: 19.4 },
      { lessonNumber: 4, x: 47, y: 25.6 },
      { lessonNumber: 5, x: 60, y: 31.8 },
      { lessonNumber: 6, x: 40, y: 38 },
      { lessonNumber: 7, x: 52, y: 44.2 },
      { lessonNumber: 8, x: 63, y: 50.4 },
      { lessonNumber: 9, x: 45, y: 56.6 },
      { lessonNumber: 10, x: 55, y: 62.8 },
      { lessonNumber: 11, x: 38, y: 69 },
      { lessonNumber: 12, x: 50, y: 75.2 },
      { lessonNumber: 13, x: 62, y: 81.4 },
      { lessonNumber: 14, x: 46, y: 87.6 },
      { lessonNumber: 15, x: 56, y: 93.8 },
    ],
  },
  {
    id: 'path-2',
    labelKey: 'skillTree.lessons.chapters.pathTwoLabel',
    titleKey: 'skillTree.lessons.chapters.pathTwoTitle',
    lessonRange: [16, 30],
    backgroundPosition: 'center center',
    nodes: [
      { lessonNumber: 16, x: 50, y: 7, labelX: 66, labelY: 8.6 },
      { lessonNumber: 17, x: 60, y: 13.2 },
      { lessonNumber: 18, x: 43, y: 19.4 },
      { lessonNumber: 19, x: 54, y: 25.6 },
      { lessonNumber: 20, x: 38, y: 31.8 },
      { lessonNumber: 21, x: 57, y: 38 },
      { lessonNumber: 22, x: 66, y: 44.2 },
      { lessonNumber: 23, x: 48, y: 50.4 },
      { lessonNumber: 24, x: 35, y: 56.6 },
      { lessonNumber: 25, x: 51, y: 62.8 },
      { lessonNumber: 26, x: 62, y: 69 },
      { lessonNumber: 27, x: 45, y: 75.2 },
      { lessonNumber: 28, x: 56, y: 81.4 },
      { lessonNumber: 29, x: 40, y: 87.6 },
      { lessonNumber: 30, x: 52, y: 93.8 },
    ],
  },
  {
    id: 'path-3',
    labelKey: 'skillTree.lessons.chapters.pathThreeLabel',
    titleKey: 'skillTree.lessons.chapters.pathThreeTitle',
    lessonRange: [31, 49],
    backgroundPosition: 'bottom center',
    nodes: [
      { lessonNumber: 31, x: 50, y: 4, labelX: 66, labelY: 5.8 },
      { lessonNumber: 32, x: 39, y: 9.1 },
      { lessonNumber: 33, x: 58, y: 14.2 },
      { lessonNumber: 34, x: 45, y: 19.3 },
      { lessonNumber: 35, x: 63, y: 24.4 },
      { lessonNumber: 36, x: 52, y: 29.5 },
      { lessonNumber: 37, x: 37, y: 34.6 },
      { lessonNumber: 38, x: 57, y: 39.7 },
      { lessonNumber: 39, x: 66, y: 44.8 },
      { lessonNumber: 40, x: 48, y: 49.9 },
      { lessonNumber: 41, x: 35, y: 55 },
      { lessonNumber: 42, x: 55, y: 60.1 },
      { lessonNumber: 43, x: 43, y: 65.2 },
      { lessonNumber: 44, x: 61, y: 70.3 },
      { lessonNumber: 45, x: 50, y: 75.4 },
      { lessonNumber: 46, x: 37, y: 80.5 },
      { lessonNumber: 47, x: 56, y: 85.6 },
      { lessonNumber: 48, x: 45, y: 90.7 },
      { lessonNumber: 49, x: 52, y: 95.8 },
    ],
  },
];

export const grammarPathPositions = [
  { id: 1, x: 50, y: 7 },
  { id: 2, x: 37, y: 12 },
  { id: 3, x: 63, y: 17 },
  { id: 4, x: 45, y: 22 },
  { id: 5, x: 58, y: 27 },
  { id: 6, x: 34, y: 32 },
  { id: 7, x: 68, y: 37 },
  { id: 8, x: 50, y: 42 },
  { id: 9, x: 39, y: 47 },
  { id: 10, x: 61, y: 52 },
  { id: 11, x: 43, y: 57 },
  { id: 12, x: 66, y: 62 },
  { id: 13, x: 35, y: 67 },
  { id: 14, x: 55, y: 72 },
  { id: 15, x: 72, y: 77 },
  { id: 16, x: 45, y: 82 },
  { id: 17, x: 28, y: 87 },
  { id: 18, x: 60, y: 90 },
  { id: 19, x: 76, y: 93 },
  { id: 20, x: 50, y: 96 },
];

const sectionBySlug = new Map(sectionsData.sections.map((section) => [section.slug, section]));

function toScrollLesson(lesson, sectionSlug, topic, index) {
  const hasRoute = !lesson.comingSoon && lesson.contentFile && AVAILABLE_CONTENT_FILES.has(lesson.contentFile);
  const number = String(index + 1).padStart(2, '0');
  const kanaByTopic = {
    kanji: KANJI_BATCH_LABELS[index],
    lessons: JAPANESE_NUMERALS[index],
    grammar: JAPANESE_NUMERALS[index],
  };

  return {
    id: lesson.id,
    lessonId: hasRoute ? lesson.id : null,
    sectionSlug: hasRoute ? sectionSlug : null,
    lessonSlug: hasRoute ? lesson.slug : null,
    kana: kanaByTopic[topic] ?? number,
    title: lesson.title,
  };
}

function buildPathConfig({ topic, titleJp, label, sectionSlug, image, positions }) {
  const section = sectionBySlug.get(sectionSlug);
  const lessons = section?.lessons.slice(0, positions.length).map((lesson, index) =>
    toScrollLesson(lesson, sectionSlug, topic, index),
  ) ?? [];

  return {
    topic,
    titleJp,
    label,
    totalLessons: positions.length,
    image,
    positions,
    lessons,
    mobileChapters: topic === 'lessons' ? lessonsMobileChapters : [],
  };
}

export const SCROLL_PATH_CONFIGS = {
  kanji: buildPathConfig({
    topic: 'kanji',
    titleJp: '漢字',
    label: 'Kanji',
    sectionSlug: 'kanji',
    image: '/kanji_tree.png',
    positions: kanjiPathPositions,
  }),
  lessons: buildPathConfig({
    topic: 'lessons',
    titleJp: '会話',
    label: 'Lessons',
    sectionSlug: 'dialogues',
    image: '/lessons_tree.png',
    positions: lessonsPathPositions,
  }),
  grammar: buildPathConfig({
    topic: 'grammar',
    titleJp: '文法',
    label: 'Grammar',
    sectionSlug: 'grammar',
    image: '/grammar_tree.png',
    positions: grammarPathPositions,
  }),
};

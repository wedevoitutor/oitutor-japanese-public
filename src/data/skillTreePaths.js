// Full N5 curriculum — each entry is one SKILL (not a lesson).
// `lessonId` links to sections.json for completion tracking. null = content not built yet.

const HIRAGANA_ROWS = [
  // Base (10)
  { icon: 'あ', title: 'あ行 — Vowels', lessonId: 'hiragana-row-vowels', sectionSlug: 'hiragana', lessonSlug: 'row-vowels' },
  { icon: 'か', title: 'か行 — K-row', lessonId: 'hiragana-row-k', sectionSlug: 'hiragana', lessonSlug: 'row-k' },
  { icon: 'さ', title: 'さ行 — S-row', lessonId: 'hiragana-row-s', sectionSlug: 'hiragana', lessonSlug: 'row-s' },
  { icon: 'た', title: 'た行 — T-row', lessonId: 'hiragana-row-t', sectionSlug: 'hiragana', lessonSlug: 'row-t' },
  { icon: 'な', title: 'な行 — N-row', lessonId: 'hiragana-row-n', sectionSlug: 'hiragana', lessonSlug: 'row-n' },
  { icon: 'は', title: 'は行 — H-row', lessonId: 'hiragana-row-h', sectionSlug: 'hiragana', lessonSlug: 'row-h' },
  { icon: 'ま', title: 'ま行 — M-row', lessonId: 'hiragana-row-m', sectionSlug: 'hiragana', lessonSlug: 'row-m' },
  { icon: 'や', title: 'や行 — Y-row', lessonId: 'hiragana-row-y', sectionSlug: 'hiragana', lessonSlug: 'row-y' },
  { icon: 'ら', title: 'ら行 — R-row', lessonId: 'hiragana-row-r', sectionSlug: 'hiragana', lessonSlug: 'row-r' },
  { icon: 'わ', title: 'わ行 — W-row + N', lessonId: 'hiragana-row-w', sectionSlug: 'hiragana', lessonSlug: 'row-w' },
  // Dakuten (4)
  { icon: 'が', title: 'が行 — G-row (Dakuten)', lessonId: null },
  { icon: 'ざ', title: 'ざ行 — Z-row (Dakuten)', lessonId: null },
  { icon: 'だ', title: 'だ行 — D-row (Dakuten)', lessonId: null },
  { icon: 'ば', title: 'ば行 — B-row (Dakuten)', lessonId: null },
  // Handakuten (1)
  { icon: 'ぱ', title: 'ぱ行 — P-row (Handakuten)', lessonId: null },
  // Yōon (3 groups)
  { icon: 'きゃ', title: 'Yōon I — Kya・Sha・Cha', lessonId: null },
  { icon: 'にゃ', title: 'Yōon II — Nya・Hya・Mya・Rya', lessonId: null },
  { icon: 'ぎゃ', title: 'Yōon III — Gya・Ja・Bya・Pya', lessonId: null },
];

const KATAKANA_ROWS = [
  // Base (10)
  { icon: 'ア', title: 'ア行 — Vowels', lessonId: 'katakana-row-vowels', sectionSlug: 'katakana', lessonSlug: 'row-vowels' },
  { icon: 'カ', title: 'カ行 — K-row', lessonId: 'katakana-row-k', sectionSlug: 'katakana', lessonSlug: 'row-k' },
  { icon: 'サ', title: 'サ行 — S-row', lessonId: 'katakana-row-s', sectionSlug: 'katakana', lessonSlug: 'row-s' },
  { icon: 'タ', title: 'タ行 — T-row', lessonId: 'katakana-row-t', sectionSlug: 'katakana', lessonSlug: 'row-t' },
  { icon: 'ナ', title: 'ナ行 — N-row', lessonId: 'katakana-row-n', sectionSlug: 'katakana', lessonSlug: 'row-n' },
  { icon: 'ハ', title: 'ハ行 — H-row', lessonId: 'katakana-row-h', sectionSlug: 'katakana', lessonSlug: 'row-h' },
  { icon: 'マ', title: 'マ行 — M-row', lessonId: 'katakana-row-m', sectionSlug: 'katakana', lessonSlug: 'row-m' },
  { icon: 'ヤ', title: 'ヤ行 — Y-row', lessonId: 'katakana-row-y', sectionSlug: 'katakana', lessonSlug: 'row-y' },
  { icon: 'ラ', title: 'ラ行 — R-row', lessonId: 'katakana-row-r', sectionSlug: 'katakana', lessonSlug: 'row-r' },
  { icon: 'ワ', title: 'ワ行 — W-row + N', lessonId: 'katakana-row-w', sectionSlug: 'katakana', lessonSlug: 'row-w' },
  // Dakuten (4)
  { icon: 'ガ', title: 'ガ行 — G-row (Dakuten)', lessonId: null },
  { icon: 'ザ', title: 'ザ行 — Z-row (Dakuten)', lessonId: null },
  { icon: 'ダ', title: 'ダ行 — D-row (Dakuten)', lessonId: null },
  { icon: 'バ', title: 'バ行 — B-row (Dakuten)', lessonId: null },
  // Handakuten (1)
  { icon: 'パ', title: 'パ行 — P-row (Handakuten)', lessonId: null },
  // Yōon (3 groups)
  { icon: 'キャ', title: 'Yōon I — Kya・Sha・Cha', lessonId: null },
  { icon: 'ニャ', title: 'Yōon II — Nya・Hya・Mya・Rya', lessonId: null },
  { icon: 'ギャ', title: 'Yōon III — Gya・Ja・Bya・Pya', lessonId: null },
];

const KANJI_BATCHES = [
  ['日', '一', '人', '年', '大'],
  ['十', '二', '本', '中', '出'],
  ['三', '見', '月', '生', '五'],
  ['上', '四', '金', '九', '入'],
  ['学', '円', '子', '八', '六'],
  ['下', '気', '小', '七', '山'],
  ['女', '百', '先', '名', '川'],
  ['千', '水', '男', '校', '土'],
  ['木', '車', '白', '天'],
  ['火', '田', '右', '左'],
  ['北', '口', '目', '足'],
  ['耳', '手', '力', '国'],
  ['外', '花', '雨', '電'],
  ['食', '飲', '語', '読'],
  ['書', '話', '聞', '買'],
  ['行', '来', '帰', '長'],
  ['高', '安', '新', '古'],
  ['多', '少', '早', '休'],
];

const kanjiSkills = KANJI_BATCHES.map((batch, i) => {
  const num = String(i + 1).padStart(2, '0');
  const lessonId = `kanji-${num}`;
  return {
    icon: batch[0],
    title: batch.join('・'),
    lessonId,
    sectionSlug: 'kanji',
    lessonSlug: `kanji-${num}`,
  };
});

const GRAMMAR_TOPICS = [
  'Pronouns & Demonstratives', 'The Copula: da / desu', 'Core Particles: wa, ga, mo',
  'Object & Direction: wo, ni, e', 'Location & Means: de, ni', 'Connecting Particles',
  'Question Words', 'Existence: arimasu & imasu', 'Verb Groups & masu-Form',
  'Plain Form & Negative nai', 'Past Tense: ta-Form', 'te-Form Basics',
  'Desires: tai & hoshii', 'i-Adjectives', 'na-Adjectives',
  'Adverbs & Degree Words', 'Time Expressions & Counters', 'Before, After & Sequence',
  'Giving Reasons: kara & node', 'Permissions & Probability',
];

const grammarSkills = GRAMMAR_TOPICS.map((topic, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    icon: `${i + 1}`,
    title: topic,
    lessonId: `grammar-${num}`,
    sectionSlug: 'grammar',
    lessonSlug: `grammar-${num}`,
  };
});

const DIALOGUE_TOPICS = [
  { title: 'First Meeting', icon: '🤝' },
  { title: 'Asking for Help', icon: '🙋' },
  { title: 'Clarification Phrases', icon: '🔄' },
  { title: 'Asking Directions', icon: '🧭' },
  { title: 'Personal Information', icon: '📋' },
  { title: 'Countries & Nationalities', icon: '🌍' },
  { title: 'Basic Verbs', icon: '🏃' },
  { title: 'Possession', icon: '🎒' },
  { title: 'Question Forms', icon: '❓' },
  { title: 'Numbers 0-100', icon: '🔢' },
  { title: 'Negations & Affirmations', icon: '✅' },
  { title: 'Days of the Week', icon: '📅' },
  { title: 'Months & Dates', icon: '🗓️' },
  { title: 'Telling the Time', icon: '⏰' },
  { title: 'Family Members', icon: '👨‍👩‍👧' },
  { title: 'Describing People', icon: '🧑' },
  { title: 'Colours', icon: '🎨' },
  { title: 'Basic Shapes', icon: '🔷' },
  { title: 'Likes & Dislikes', icon: '👍' },
  { title: 'Simple Opinions', icon: '💬' },
  { title: 'Daily Routines', icon: '☀️' },
  { title: 'My Job / Studies', icon: '💼' },
  { title: 'School Subjects', icon: '📚' },
  { title: 'Free-Time Hobbies', icon: '🎮' },
  { title: 'Music Preferences', icon: '🎵' },
  { title: 'Sports & Exercise', icon: '⚽' },
  { title: 'Favourite Foods', icon: '🍣' },
  { title: 'Cooking Verbs', icon: '🍳' },
  { title: 'Ordering in a Cafe', icon: '☕' },
  { title: 'Restaurant Etiquette', icon: '🍽️' },
  { title: 'Shopping for Groceries', icon: '🛒' },
  { title: 'Clothes & Prices', icon: '👕' },
  { title: 'My House / Apartment', icon: '🏠' },
  { title: 'Rooms & Furniture', icon: '🛋️' },
  { title: 'Pets & Animals', icon: '🐕' },
  { title: 'Places in Town', icon: '🏙️' },
  { title: 'Simple Directions', icon: '🗺️' },
  { title: 'Transport Tickets', icon: '🎫' },
  { title: 'City vs Countryside', icon: '🌾' },
  { title: 'Weather Today', icon: '🌤️' },
  { title: 'Environment Words', icon: '🌿' },
  { title: 'Parts of the Body', icon: '🦵' },
  { title: 'Health Basics', icon: '💊' },
  { title: 'At the Doctor', icon: '🩺' },
  { title: 'Celebrations & Birthdays', icon: '🎂' },
  { title: 'Holiday Plans', icon: '✈️' },
  { title: 'Basic Technology', icon: '💻' },
  { title: 'Emails & Postcards', icon: '✉️' },
  { title: 'Simple Phone Calls', icon: '📞' },
];

const dialogueSkills = DIALOGUE_TOPICS.map((d, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    icon: d.icon,
    title: d.title,
    lessonId: `dialogue-${num}`,
    sectionSlug: 'dialogues',
    lessonSlug: `dialogue-${num}`,
  };
});

export const SKILL_PATHS = [
  {
    id: 'alphabets',
    titleJp: 'あ/ア',
    label: 'Alphabets',
    skills: [...HIRAGANA_ROWS, ...KATAKANA_ROWS],
  },
  {
    id: 'kanji',
    titleJp: '漢字',
    label: 'Kanji',
    skills: kanjiSkills,
    prereqs: ['alphabets'],
  },
  {
    id: 'lessons',
    titleJp: '会話',
    label: 'Lessons',
    skills: dialogueSkills,
  },
  {
    id: 'grammar',
    titleJp: '文法',
    label: 'Grammar',
    skills: grammarSkills,
  },
];

// scripts/generate-lessons.js
// Run: node scripts/generate-lessons.js
// Generates all JSON lesson files from kana-data.js into src/content/<section>/

import { writeFileSync, mkdirSync } from 'fs';
import { HIRAGANA_ROWS, HIRAGANA_PLAN, KATAKANA_ROWS, KATAKANA_PLAN } from './kana-data.js';

// --- Utilities ---

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Builder functions (one per exercise type) ---

function buildReferenceChart(rows) {
  return {
    type: 'reference-chart',
    title: rows.map((r) => `${r.title} — ${r.titleJp}`).join(' + '),
    rows: rows.map((r) => r.chars.map(([k, rom]) => `${k} ${rom}`)),
  };
}

function buildFlashcards(rows, maxCount = null) {
  let cards = shuffle(rows.flatMap((r) => r.chars.map(([k, rom]) => ({
    front: k,
    back: rom,
    speakText: k,
  }))));
  if (maxCount) cards = cards.slice(0, maxCount);
  return { type: 'flashcard', cards };
}

function buildMultipleChoice(rows, count) {
  const allChars = rows.flatMap((r) => r.chars);
  // Ensure we don't request more questions than we have characters
  const safeCount = Math.min(count, allChars.length);
  const selected = shuffle([...allChars]).slice(0, safeCount);

  return selected.map(([kana, rom]) => {
    const distractors = shuffle(allChars.filter(([k]) => k !== kana)).slice(0, 3);
    // For small rows (<4 chars) we may have fewer than 3 distractors — that's fine
    const allOptions = shuffle([...distractors.map(([k]) => k), kana]);
    return {
      type: 'multiple-choice',
      prompt: `Which character is '${rom}'?`,
      options: allOptions,
      correctIndex: allOptions.indexOf(kana),
    };
  });
}

function buildMatching(chars, maxPairs) {
  const selected = shuffle([...chars]).slice(0, maxPairs);
  return {
    type: 'matching',
    pairs: selected.map(([k, rom]) => [k, rom]),
  };
}

function buildTypeTheAnswer(rows, maxCount = null) {
  let allChars = shuffle(rows.flatMap((r) => r.chars));
  if (maxCount) allChars = allChars.slice(0, maxCount);
  return allChars.map(([k, rom, alts]) => {
    const ex = { type: 'type-the-answer', prompt: k, answer: rom };
    if (alts) ex.acceptAlternatives = alts;
    return ex;
  });
}

function buildVocabChart(sentences) {
  return {
    type: 'reference-chart',
    title: 'Reading Practice — Vocabulary',
    rows: [['NIHONGO', 'ENGLISH'], ...sentences.flatMap((s) => s.vocab)],
  };
}

function buildFillInTheBlanks(sentences) {
  return sentences.map((s) => {
    const ex = {
      type: 'fill-in-the-blank',
      sentence: s.sentence,
      blank: s.blank,
      options: shuffle([...s.options]),
    };
    if (s.japaneseSentence) ex.speakText = s.japaneseSentence;
    return ex;
  });
}

function buildListening(sentences) {
  return sentences
    .filter((s) => s.listening)
    .map((s) => ({
      type: 'listening',
      speakText: s.listening.speakText,
      prompt: s.listening.prompt,
      options: s.listening.options,
      correctIndex: s.listening.correctIndex,
    }));
}

function buildListenAndOrder(sentences) {
  return sentences
    .filter((s) => s.listenAndOrder)
    .map((s) => ({
      type: 'listen-and-order',
      speakText: s.listenAndOrder.speakText,
      segments: s.listenAndOrder.segments,
      correctOrder: s.listenAndOrder.correctOrder,
    }));
}

// --- Lesson assembler (interleaved exercise flow) ---

function generateLesson(plan, allRows) {
  const rows = plan.rows.map((i) => allRows[i]);
  const allChars = rows.flatMap((r) => r.chars);

  const isRow = plan.type === 'row';
  const isReview = plan.type === 'review';
  const isCumulative = plan.type === 'cumulative';

  const sentences = isReview
    ? [rows[0].sentences[0], rows[rows.length - 1].sentences[0]]
    : rows.flatMap((r) => r.sentences);

  // Pre-build exercise pools
  const mcCount = isReview ? 5 : isRow ? 3 : 4;
  const mc = buildMultipleChoice(rows, mcCount);
  const ttaCount = isReview ? 10 : isCumulative ? 6 : null;
  const tta = buildTypeTheAnswer(rows, ttaCount);
  const listeningExs = buildListening(sentences);
  const fillExs = buildFillInTheBlanks(sentences);
  const orderExs = buildListenAndOrder(sentences);
  const vocabChart = buildVocabChart(sentences);

  const next = (pool) => pool.shift();
  const exercises = [];

  if (isRow) {
    exercises.push(buildReferenceChart(rows));                      //  1. Reference chart
    exercises.push(buildFlashcards(rows));                          //  2. Flashcards
    exercises.push(next(mc));                                       //  3. MC #1
    exercises.push(next(tta));                                      //  4. TTA #1
    exercises.push(buildMatching(allChars, allChars.length));       //  5. Matching
    exercises.push(next(mc));                                       //  6. MC #2
    exercises.push(next(tta));                                      //  7. TTA #2
    exercises.push(next(listeningExs));                             //  8. Listening
    exercises.push(next(tta));                                      //  9. TTA #3
    exercises.push(vocabChart);                                     // 10. Vocab chart
    exercises.push(next(fillExs));                                  // 11. Fill-in-the-blank
    exercises.push(next(mc));                                       // 12. MC #3
    exercises.push(next(tta));                                      // 13. TTA #4
    exercises.push(next(orderExs));                                 // 14. Listen-and-order
    exercises.push(next(tta));                                      // 15. TTA #5
  } else if (isCumulative) {
    exercises.push(buildFlashcards(rows));                          //  1. Flashcards
    exercises.push(next(mc));                                       //  2. MC #1
    exercises.push(next(tta));                                      //  3. TTA #1
    exercises.push(buildMatching(allChars, 5));                     //  4. Matching
    exercises.push(next(mc));                                       //  5. MC #2
    exercises.push(next(listeningExs));                             //  6. Listening #1
    exercises.push(next(tta));                                      //  7. TTA #2
    exercises.push(next(mc));                                       //  8. MC #3
    exercises.push(next(tta));                                      //  9. TTA #3
    exercises.push(vocabChart);                                     // 10. Vocab chart
    exercises.push(next(fillExs));                                  // 11. Fill-in-the-blank #1
    exercises.push(next(tta));                                      // 12. TTA #4
    exercises.push(next(orderExs));                                 // 13. Listen-and-order #1
    exercises.push(next(mc));                                       // 14. MC #4
    exercises.push(next(tta));                                      // 15. TTA #5
    exercises.push(next(listeningExs));                             // 16. Listening #2
    exercises.push(next(fillExs));                                  // 17. Fill-in-the-blank #2
    exercises.push(next(tta));                                      // 18. TTA #6
    exercises.push(next(orderExs));                                 // 19. Listen-and-order #2
  } else {
    const shuffledAll = shuffle([...allChars]);
    exercises.push(buildFlashcards(rows, 20));                      //  1. Flashcards
    exercises.push(next(mc));                                       //  2. MC #1
    exercises.push(next(tta));                                      //  3. TTA #1
    exercises.push(buildMatching(shuffledAll.slice(0, 5), 5));      //  4. Matching #1
    exercises.push(next(mc));                                       //  5. MC #2
    exercises.push(next(tta));                                      //  6. TTA #2
    exercises.push(next(listeningExs));                             //  7. Listening #1
    exercises.push(next(tta));                                      //  8. TTA #3
    exercises.push(next(mc));                                       //  9. MC #3
    exercises.push(buildMatching(shuffledAll.slice(5, 10), 5));     // 10. Matching #2
    exercises.push(next(tta));                                      // 11. TTA #4
    exercises.push(vocabChart);                                     // 12. Vocab chart
    exercises.push(next(fillExs));                                  // 13. Fill-in-the-blank #1
    exercises.push(next(tta));                                      // 14. TTA #5
    exercises.push(next(mc));                                       // 15. MC #4
    exercises.push(next(orderExs));                                 // 16. Listen-and-order #1
    exercises.push(next(tta));                                      // 17. TTA #6
    exercises.push(next(tta));                                      // 18. TTA #7
    exercises.push(next(listeningExs));                             // 19. Listening #2
    exercises.push(next(mc));                                       // 20. MC #5
    exercises.push(next(tta));                                      // 21. TTA #8
    exercises.push(next(fillExs));                                  // 22. Fill-in-the-blank #2
    exercises.push(next(tta));                                      // 23. TTA #9
    exercises.push(next(orderExs));                                 // 24. Listen-and-order #2
    exercises.push(next(tta));                                      // 25. TTA #10
  }

  return { exercises: exercises.filter(Boolean) };
}

// --- Slug generator ---

function slugFromPlan(plan, allRows) {
  if (plan.slug) return plan.slug;
  const rows = plan.rows.map((i) => allRows[i]);
  if (plan.type === 'row') return `row-${rows[0].name}`;
  return `cumulative-${rows.map((r) => r.name).join('-')}`;
}

// --- File output ---

function generateAll(section, rowData, planData) {
  const dir = `src/content/${section}`;
  mkdirSync(dir, { recursive: true });

  planData.forEach((plan) => {
    const slug = slugFromPlan(plan, rowData);
    const lesson = generateLesson(plan, rowData);
    lesson.id = `${section}-${slug}`;

    const outPath = `${dir}/${slug}.json`;
    writeFileSync(outPath, JSON.stringify(lesson, null, 2));
    console.log(`  ✓ ${outPath}`);
  });
}

// --- Run ---

console.log('Generating hiragana...');
generateAll('hiragana', HIRAGANA_ROWS, HIRAGANA_PLAN);
console.log(`Done. ${HIRAGANA_PLAN.length} files written.`);

console.log('Generating katakana...');
generateAll('katakana', KATAKANA_ROWS, KATAKANA_PLAN);
console.log(`Done. ${KATAKANA_PLAN.length} files written.`);

// Uncomment each block as you add the data to kana-data.js:

// console.log('Generating dakuten...');
// generateAll('dakuten', DAKUTEN_ROWS, DAKUTEN_PLAN);

// console.log('Generating yoon...');
// generateAll('yoon', YOON_ROWS, YOON_PLAN);

#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/dialogues';
const HAS_JP = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;
const VALID_TYPES = new Set([
  'reference-chart',
  'dialogue-scene',
  'comparison-cards',
  'formula-fill',
  'flashcard',
  'multiple-choice',
  'response-selection',
  'type-the-answer',
  'shadowing',
  'matching',
  'reading-practice',
]);

function countType(exercises, type) {
  return exercises.filter((e) => e.type === type).length;
}

function validate(file) {
  const errs = [];
  let lesson;
  try {
    lesson = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    return [`JSON parse failed: ${error.message}`];
  }

  const ex = lesson.exercises ?? [];
  const nn = file.match(/lesson-(\d{2})\.json$/)?.[1];
  const expectedOrder = [
    'reference-chart',
    ...Array(3).fill('dialogue-scene'),
    ...Array(4).fill('comparison-cards'),
    ...Array(3).fill('formula-fill'),
    'flashcard',
    ...Array(8).fill('multiple-choice'),
    ...Array(6).fill('response-selection'),
    ...Array(8).fill('type-the-answer'),
    ...Array(9).fill('shadowing'),
    'matching',
    'reading-practice',
  ];

  if (!nn) errs.push('filename must be lesson-NN.json');
  if (lesson.id !== `dialogues-lesson-${nn}`) errs.push(`id must be dialogues-lesson-${nn}, got ${lesson.id}`);
  if (ex.length !== 45) errs.push(`exercise count must be 45, got ${ex.length}`);
  if (ex.at(-1)?.type !== 'reading-practice') errs.push('final exercise must be reading-practice');
  const actualOrder = ex.map((e) => e.type);
  if (actualOrder.length === expectedOrder.length && actualOrder.some((type, i) => type !== expectedOrder[i])) {
    errs.push('exercise order/type distribution differs from established dialogue rhythm');
  }

  if (countType(ex, 'reference-chart') !== 1) errs.push('needs exactly one reference-chart');
  if (countType(ex, 'dialogue-scene') !== 3) errs.push('needs exactly three dialogue-scene exercises');
  if (countType(ex, 'comparison-cards') !== 4) errs.push('needs exactly four comparison-cards exercises');
  if (countType(ex, 'formula-fill') !== 3) errs.push('needs exactly three formula-fill exercises');
  if (countType(ex, 'flashcard') !== 1) errs.push('needs exactly one flashcard exercise');
  if (countType(ex, 'multiple-choice') !== 8) errs.push('needs exactly eight multiple-choice exercises');
  if (countType(ex, 'response-selection') !== 6) errs.push('needs exactly six response-selection exercises');
  if (countType(ex, 'type-the-answer') !== 8) errs.push('needs exactly eight type-the-answer exercises');
  if (countType(ex, 'shadowing') !== 9) errs.push('needs exactly nine shadowing exercises');
  if (countType(ex, 'matching') !== 1) errs.push('needs exactly one matching exercise');
  if (countType(ex, 'reading-practice') !== 1) errs.push('needs exactly one reading-practice exercise');

  const raw = JSON.stringify(lesson).toLowerCase();
  for (const bad of ['todo', 'fixme', 'placeholder', 'review meaning', 'sentence chunk']) {
    if (raw.includes(bad)) errs.push(`contains forbidden placeholder marker: ${bad}`);
  }

  ex.forEach((e, i) => {
    const at = `[${i}] ${e.type}`;
    if (!VALID_TYPES.has(e.type)) errs.push(`${at}: unsupported exercise type`);

    if (e.type === 'reference-chart') {
      if (!e.title || !e.intro || !e.takeaway) errs.push(`${at}: missing title/intro/takeaway`);
      if (!Array.isArray(e.rows) || e.rows.length < 4) errs.push(`${at}: rows too small`);
    }

    if (e.type === 'dialogue-scene') {
      if (!e.title || !e.register) errs.push(`${at}: missing title/register`);
      if (!Array.isArray(e.lines) || e.lines.length !== 3) errs.push(`${at}: needs exactly 3 lines`);
      (e.lines || []).forEach((line, j) => {
        if (!line.speaker || !line.jp || !line.romaji || !line.en) errs.push(`${at}.lines[${j}]: missing speaker/jp/romaji/en`);
      });
    }

    if (e.type === 'comparison-cards') {
      const correct = (e.variants || []).filter((v) => v.correct === true).length;
      if ((e.variants || []).length < 2 || (e.variants || []).length > 4) errs.push(`${at}: variants must be 2-4`);
      if (correct !== 1) errs.push(`${at}: expected exactly one correct variant`);
    }

    if (e.type === 'formula-fill') {
      if (!e.slot?.answer || !e.slot?.answerRomaji || !e.slot?.hint) errs.push(`${at}: missing slot answer/romaji/hint`);
      if (e.slot?.hint && HAS_JP.test(e.slot.hint)) errs.push(`${at}: hint must not contain Japanese answer text`);
      if (!(e.patternJp || []).includes('[SLOT]')) errs.push(`${at}: patternJp missing [SLOT]`);
      if (!e.speakText) errs.push(`${at}: missing speakText`);
    }

    if (e.type === 'flashcard') {
      if (!Array.isArray(e.cards) || e.cards.length < 8 || e.cards.length > 10) errs.push(`${at}: flashcard needs 8-10 cards`);
    }

    if (e.type === 'multiple-choice') {
      if ((e.options || []).length !== 4) errs.push(`${at}: multiple-choice needs exactly 4 options`);
      const objectCorrect = (e.options || []).filter((o) => typeof o === 'object' && o.correct === true).length;
      if (typeof e.correctIndex !== 'number' && objectCorrect !== 1) errs.push(`${at}: missing correctIndex or single correct option object`);
      if (!e.speakText) errs.push(`${at}: missing speakText`);
    }

    if (e.type === 'response-selection') {
      if (!e.question?.jp || !e.question?.romaji || !e.question?.speakText) errs.push(`${at}: missing question jp/romaji/speakText`);
      if ((e.options || []).length < 3) errs.push(`${at}: needs at least 3 options`);
      const correct = (e.options || []).filter((o) => o.correct === true).length;
      if (typeof e.correctIndex !== 'number' && correct !== 1) errs.push(`${at}: missing correctIndex or single correct option`);
    }

    if (e.type === 'type-the-answer') {
      if (!e.speakText || !e.answer) errs.push(`${at}: missing speakText/answer`);
    }

    if (e.type === 'shadowing') {
      if (!e.jp || !e.romaji || !e.en || !e.speakText || !e.speaker) errs.push(`${at}: missing jp/romaji/en/speakText/speaker`);
    }

    if (e.type === 'matching') {
      const n = e.pairs?.length ?? 0;
      if (n < 8 || n > 10) errs.push(`${at}: matching pairs must be 8-10`);
    }

    if (e.type === 'reading-practice') {
      if ((e.cards || []).length !== 10) errs.push(`${at}: reading-practice needs exactly 10 cards`);
    }
  });

  return errs;
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => join(DIR, f));

let bad = 0;
for (const f of files) {
  const errs = validate(f);
  if (errs.length) {
    bad++;
    console.log(`\nFAIL ${f}`);
    errs.forEach((e) => console.log(`  - ${e}`));
  } else {
    console.log(`OK   ${f}`);
  }
}
process.exit(bad ? 1 : 0);

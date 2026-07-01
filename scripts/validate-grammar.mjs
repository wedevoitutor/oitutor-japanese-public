#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/grammar';
const HAS_JP = /[぀-ゟ゠-ヿ一-鿿]/;
const TAIL_SHAPE = ['comparison-cards','comparison-cards','comparison-cards','comparison-cards','reference-chart','multiple-choice','multiple-choice','multiple-choice','multiple-choice','multiple-choice','multiple-choice','multiple-choice','multiple-choice','type-the-answer','type-the-answer','type-the-answer','type-the-answer','type-the-answer','type-the-answer','type-the-answer','matching','reading-practice'];

const validate = (file) => {
  const errs = [];
  const lesson = JSON.parse(readFileSync(file, 'utf8'));
  const ex = lesson.exercises ?? [];

  if (!/^grammar-lesson-\d{2}$/.test(lesson.id ?? '')) errs.push(`id "${lesson.id}" must match grammar-lesson-NN`);
  if (ex.length < 28 || ex.length > 42) errs.push(`exercise count ${ex.length} outside 28–42`);

  const tail = ex.slice(-22).map(e => e.type);
  TAIL_SHAPE.forEach((expected, i) => {
    if (tail[i] !== expected) errs.push(`tail[${i}] expected ${expected}, got ${tail[i]}`);
  });

  ex.forEach((e, i) => {
    const at = `[${i}] ${e.type}`;
    if (e.type === 'fill-in-the-blank' || e.type === 'flashcard') errs.push(`${at}: deprecated type`);

    if (e.type === 'reference-chart') {
      const isTeach = i < ex.length - 22;
      if (isTeach && !e.intro) errs.push(`${at}: teaching chart missing intro`);
      if (isTeach && !e.takeaway) errs.push(`${at}: teaching chart missing takeaway`);
      const bodyRows = (e.rows?.length ?? 0) - 1;
      if (bodyRows > 8) errs.push(`${at}: ${bodyRows} body rows > 8`);
    }

    if (e.type === 'formula-fill') {
      if (!e.slot?.answer) errs.push(`${at}: missing slot.answer`);
      if (!e.slot?.answerRomaji) errs.push(`${at}: missing slot.answerRomaji`);
      if (!e.slot?.hint) errs.push(`${at}: missing slot.hint`);
      if (e.slot?.hint && HAS_JP.test(e.slot.hint)) errs.push(`${at}: slot.hint contains JP "${e.slot.hint}"`);
      if (!e.speakText) errs.push(`${at}: missing speakText`);
      const slotInPattern = (e.patternJp ?? []).includes('[SLOT]');
      if (!slotInPattern) errs.push(`${at}: patternJp missing [SLOT] token`);
    }

    if (e.type === 'comparison-cards') {
      const n = e.variants?.length ?? 0;
      if (n < 3 || n > 4) errs.push(`${at}: ${n} variants, expected 3–4`);
      const correctCount = (e.variants ?? []).filter(v => v.correct === true).length;
      if (correctCount !== 1) errs.push(`${at}: ${correctCount} correct variants, expected exactly 1`);
    }

    if (e.type === 'multiple-choice') {
      if ((e.options?.length ?? 0) !== 4) errs.push(`${at}: needs exactly 4 options`);
      if (typeof e.correctIndex !== 'number') errs.push(`${at}: missing correctIndex`);
    }

    if (e.type === 'matching') {
      const n = e.pairs?.length ?? 0;
      if (n < 8 || n > 10) errs.push(`${at}: ${n} pairs, expected 8–10`);
    }

    if (e.type === 'reading-practice') {
      if ((e.cards?.length ?? 0) !== 10) errs.push(`${at}: needs exactly 10 cards`);
      if (i !== ex.length - 1) errs.push(`${at}: must be the LAST exercise`);
    }
  });

  return errs;
};

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => join(DIR, f));

let bad = 0;
for (const f of files) {
  const errs = validate(f);
  if (errs.length) {
    bad++;
    console.log(`\nFAIL ${f}`);
    errs.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log(`OK   ${f}`);
  }
}
process.exit(bad ? 1 : 0);

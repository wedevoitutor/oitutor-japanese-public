import { useState, useEffect } from 'react';

const INITIAL = { currentIdx: 0, correctCount: 0, maxReachedIdx: 0 };

const buildKey = (sectionSlug, lessonSlug) =>
  `lesson-progress-${sectionSlug}-${lessonSlug}`;

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : { ...INITIAL };
  } catch {
    return { ...INITIAL };
  }
}

export default function useLessonProgress(sectionSlug, lessonSlug) {
  const key = buildKey(sectionSlug, lessonSlug);
  const [progress, setProgress] = useState(() => load(key));

  useEffect(() => {
    setProgress(load(key));
  }, [key]);

  const update = (partial) => {
    setProgress((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clear = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
    setProgress({ ...INITIAL });
  };

  return { progress, update, clear };
}

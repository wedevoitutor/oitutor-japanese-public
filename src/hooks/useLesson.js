import { useState, useEffect } from 'react';
import { loadLesson, AVAILABLE_CONTENT_FILES } from '../lib/contentLoader';
import sectionsData from '../content/sections.json';

export function useSections() {
  return sectionsData.sections;
}

const hasContent = (l) =>
  !l.comingSoon && !!l.contentFile && AVAILABLE_CONTENT_FILES.has(l.contentFile);

const countPlannedLessons = (lessons) =>
  lessons.reduce((sum, lesson) => sum + (lesson.plannedCount ?? 1), 0);

export function useAllLessonIds() {
  return sectionsData.sections.flatMap((s) =>
    s.lessons.filter(hasContent).map((l) => l.id),
  );
}

export function usePlannedLessonCount() {
  return sectionsData.sections.reduce(
    (sum, section) => sum + countPlannedLessons(section.lessons),
    0,
  );
}

export function findLessonMeta(sectionSlug, lessonSlug) {
  for (const section of sectionsData.sections) {
    if (section.slug !== sectionSlug) continue;
    const lesson = section.lessons.find((l) => l.slug === lessonSlug);
    if (lesson) return { section, lesson };
  }
  return null;
}

export function findNextLessonPath(currentLessonId) {
  for (const section of sectionsData.sections) {
    const lessons = section.lessons.filter(hasContent);
    const idx = lessons.findIndex((l) => l.id === currentLessonId);
    if (idx < 0) continue;
    if (idx + 1 >= lessons.length) return null; // last lesson in this path
    return `/curriculum/${section.slug}/${lessons[idx + 1].slug}`;
  }
  return null;
}

export function useLesson(contentFile) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contentFile) return;
    setLoading(true);
    loadLesson(contentFile)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [contentFile]);

  return { data, loading, error };
}

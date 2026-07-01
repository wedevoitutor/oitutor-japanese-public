export function getLessonNumber(lesson, lessons) {
  const index = lessons.findIndex((item) => item.id === lesson?.id);
  return index >= 0 ? index + 1 : null;
}

export function getCurrentLessonNumber(lessons) {
  const currentIndex = lessons.findIndex((lesson) => lesson.status === 'current');
  if (currentIndex >= 0) return currentIndex + 1;

  const firstAvailableIndex = lessons.findIndex((lesson) => lesson.status === 'available');
  if (firstAvailableIndex >= 0) return firstAvailableIndex + 1;

  const lastCompletedIndex = lessons.findLastIndex((lesson) => lesson.status === 'completed');
  return Math.max(1, lastCompletedIndex + 1);
}

export function getChapterIndexForLesson(chapters, lessonNumber) {
  const index = chapters.findIndex((chapter) => {
    const [start, end] = chapter.lessonRange;
    return lessonNumber >= start && lessonNumber <= end;
  });

  return Math.max(0, index);
}

export function getChapterProgress(chapter, lessons) {
  const [start, end] = chapter.lessonRange;
  const chapterLessons = lessons.slice(start - 1, end);

  return {
    completed: chapterLessons.filter((lesson) => lesson.status === 'completed').length,
    total: chapterLessons.length,
  };
}

export function getChapterNodes(chapter, lessons) {
  return chapter.nodes
    .map((node) => ({
      ...node,
      lesson: lessons[node.lessonNumber - 1],
    }))
    .filter((node) => node.lesson);
}

export function isActionableLesson(lesson) {
  return ['completed', 'current', 'available'].includes(lesson.status) && !!lesson.route;
}

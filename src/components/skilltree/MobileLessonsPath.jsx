import { useEffect, useState } from 'react';
import LessonsChapterCarousel from './LessonsChapterCarousel';
import LessonsChapterSummary from './LessonsChapterSummary';
import LessonsChapterTabs from './LessonsChapterTabs';
import LessonsStickyCta from './LessonsStickyCta';
import {
  getChapterIndexForLesson,
  getCurrentLessonNumber,
} from './lessonMobilePathUtils';

/**
 * Chaptered mobile-only Lessons path.
 *
 * @param {object} props
 * @param {object} props.pathConfig - Lessons scroll path config.
 * @param {object[]} props.lessons - Progress-decorated Lessons path lessons.
 */
export default function MobileLessonsPath({ pathConfig, lessons }) {
  const chapters = pathConfig.mobileChapters ?? [];
  const currentLessonNumber = getCurrentLessonNumber(lessons);
  const initialChapterIndex = getChapterIndexForLesson(chapters, currentLessonNumber);
  const [activeChapterIndex, setActiveChapterIndex] = useState(initialChapterIndex);
  const [lockedMessage, setLockedMessage] = useState('');
  const activeChapter = chapters[activeChapterIndex] ?? chapters[0];
  const currentLesson = lessons[currentLessonNumber - 1];

  useEffect(() => {
    if (!lockedMessage) return undefined;
    const timer = window.setTimeout(() => setLockedMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [lockedMessage]);

  if (!activeChapter) return null;

  return (
    <div className="lessons-mobile-path md:hidden">
      <LessonsChapterTabs
        chapters={chapters}
        activeChapterIndex={activeChapterIndex}
        onChange={setActiveChapterIndex}
      />
      <LessonsChapterSummary chapter={activeChapter} lessons={lessons} />
      <LessonsChapterCarousel
        chapters={chapters}
        activeChapterIndex={activeChapterIndex}
        onActiveChapterChange={setActiveChapterIndex}
        lessons={lessons}
        image={pathConfig.image}
        onLocked={setLockedMessage}
      />
      {lockedMessage && (
        <div className="lessons-locked-feedback" role="status" aria-live="polite">
          {lockedMessage}
        </div>
      )}
      <LessonsStickyCta lesson={currentLesson} lessonNumber={currentLessonNumber} />
    </div>
  );
}

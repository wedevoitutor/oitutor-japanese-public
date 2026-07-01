import { useEffect, useState } from 'react';
import LessonsChapterSummary from './LessonsChapterSummary';
import LessonsMapPanel from './LessonsMapPanel';

/**
 * Desktop chapter layout for the Lessons path.
 *
 * @param {object} props
 * @param {object} props.pathConfig - Lessons scroll path config.
 * @param {object[]} props.lessons - Progress-decorated Lessons path lessons.
 */
export default function LessonsDesktopPath({ pathConfig, lessons }) {
  const chapters = pathConfig.mobileChapters ?? [];
  const [lockedMessage, setLockedMessage] = useState('');

  useEffect(() => {
    if (!lockedMessage) return undefined;
    const timer = window.setTimeout(() => setLockedMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [lockedMessage]);

  if (chapters.length === 0) return null;

  return (
    <div className="lessons-desktop-path hidden md:block">
      <div className="lessons-desktop-grid">
        {chapters.map((chapter) => (
          <article key={chapter.id} className="lessons-desktop-chapter">
            <LessonsChapterSummary chapter={chapter} lessons={lessons} />
            <LessonsMapPanel
              chapter={chapter}
              lessons={lessons}
              image={pathConfig.image}
              onLocked={setLockedMessage}
              variant="desktop"
            />
          </article>
        ))}
      </div>
      {lockedMessage && (
        <div className="lessons-desktop-locked-feedback" role="status" aria-live="polite">
          {lockedMessage}
        </div>
      )}
    </div>
  );
}

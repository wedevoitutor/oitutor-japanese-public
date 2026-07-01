import { useEffect, useRef } from 'react';
import LessonsMapPanel from './LessonsMapPanel';

/**
 * Mobile snap carousel for Lessons chapters.
 *
 * @param {object} props
 * @param {object[]} props.chapters - Mobile chapter configs.
 * @param {number} props.activeChapterIndex - Active chapter index.
 * @param {(index: number) => void} props.onActiveChapterChange - Scroll sync callback.
 * @param {object[]} props.lessons - Progress-decorated lessons.
 * @param {string} props.image - Decorative map image URL.
 * @param {(message: string) => void} props.onLocked - Locked-node feedback callback.
 */
export default function LessonsChapterCarousel({
  chapters,
  activeChapterIndex,
  onActiveChapterChange,
  lessons,
  image,
  onLocked,
}) {
  const carouselRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const programmaticScrollRef = useRef(false);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return undefined;

    programmaticScrollRef.current = true;
    container.scrollTo({
      left: activeChapterIndex * container.clientWidth,
      behavior: 'smooth',
    });
    const timer = window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 450);

    return () => window.clearTimeout(timer);
  }, [activeChapterIndex]);

  useEffect(() => () => {
    if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  function handleScroll() {
    const container = carouselRef.current;
    if (!container || programmaticScrollRef.current || scrollFrameRef.current) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const rawIndex = Math.round(container.scrollLeft / container.clientWidth);
      const nextIndex = Math.min(chapters.length - 1, Math.max(0, rawIndex));
      if (nextIndex !== activeChapterIndex) onActiveChapterChange(nextIndex);
      scrollFrameRef.current = null;
    });
  }

  return (
    <div ref={carouselRef} className="lessons-chapter-carousel no-scrollbar" onScroll={handleScroll}>
      {chapters.map((chapter) => (
        <div key={chapter.id} className="lessons-chapter-slide">
          <LessonsMapPanel chapter={chapter} lessons={lessons} image={image} onLocked={onLocked} />
        </div>
      ))}
    </div>
  );
}

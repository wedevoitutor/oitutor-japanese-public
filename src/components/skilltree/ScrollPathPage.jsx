import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';
import { useProgress } from '../../context/ProgressContext';
import CurrentLessonCard from './CurrentLessonCard';
import LessonsDesktopPath from './LessonsDesktopPath';
import MobileLessonsPath from './MobileLessonsPath';
import PathHeader from './PathHeader';
import ScrollPathButton from './ScrollPathButton';
import { applySequentialProgress, getPathProgress } from './pathLayout';

function getLinePoints(positions) {
  return positions.map((position) => `${position.x},${position.y}`).join(' ');
}

function getTrackIndex(lessons, currentLesson) {
  if (!currentLesson) return lessons.findLastIndex((lesson) => lesson.status === 'completed');
  return Math.max(0, lessons.findIndex((lesson) => lesson.id === currentLesson.id));
}

/**
 * Generic renderer for decorative scroll-based skill paths.
 *
 * @param {object} props
 * @param {object} props.pathConfig - Section-specific scroll config.
 * @param {boolean} [props.isPathLocked] - Whether the whole path is locked by prerequisites.
 */
export default function ScrollPathPage({ pathConfig, isPathLocked = false }) {
  const { t } = useTranslation();
  const { progress } = useProgress();
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const topic = pathConfig.topic;

  const lessons = useMemo(
    () => {
      const nextLessons = applySequentialProgress(pathConfig.lessons, progress.lessons);
      if (!isPathLocked) return nextLessons;
      return nextLessons.map((lesson) => ({ ...lesson, route: null, status: 'locked' }));
    },
    [isPathLocked, pathConfig.lessons, progress.lessons],
  );
  const positionedLessons = useMemo(
    () => lessons.map((lesson, index) => ({ ...lesson, position: pathConfig.positions[index] })).filter((lesson) => lesson.position),
    [lessons, pathConfig.positions],
  );
  const pathProgress = useMemo(() => getPathProgress(positionedLessons), [positionedLessons]);
  const currentLesson = positionedLessons.find((lesson) => lesson.status === 'current');
  const currentIndex = getTrackIndex(positionedLessons, currentLesson);
  const selectedLesson = positionedLessons.find((lesson) => lesson.id === selectedLessonId);
  const fullLine = getLinePoints(pathConfig.positions);
  const activeLine = getLinePoints(pathConfig.positions.slice(0, Math.min(currentIndex + 1, pathConfig.positions.length)));
  const isKanjiPath = topic === 'kanji';
  const isGrammarPath = topic === 'grammar';
  const isMobileEnhancedPath = isKanjiPath || isGrammarPath;
  const isLessonsPath = topic === 'lessons';
  const currentTitleKey = currentLesson?.titleKey ?? currentLesson?.title;
  const currentTitle = currentLesson ? t(currentTitleKey, { defaultValue: currentLesson.title ?? currentTitleKey }) : '';

  if (positionedLessons.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center text-sm font-semibold text-slate-500">
        {t(`skillTree.${topic}.empty`)}
      </div>
    );
  }

  return (
    <div className="path-fade-in mx-auto w-full max-w-5xl">
      <PathHeader
        title={t(`skillTree.${topic}.title`)}
        completedText={t(`skillTree.${topic}.completed`, pathProgress)}
        progressLabel={t(`skillTree.${topic}.progressLabel`)}
        completed={pathProgress.completed}
        total={pathProgress.total}
        sakuraLabel={t(`skillTree.${topic}.optionsButton`)}
        themeId={topic}
      />

      {isMobileEnhancedPath && currentLesson && (
        <div className={`${topic}-mobile-ribbon md:hidden`}>
          <span>{t(`skillTree.${topic}.currentLesson`)}</span>
          <strong>{currentTitle}</strong>
        </div>
      )}

      {isLessonsPath && (
        <>
          <MobileLessonsPath pathConfig={pathConfig} lessons={positionedLessons} />
          <LessonsDesktopPath pathConfig={pathConfig} lessons={positionedLessons} />
        </>
      )}

      {!isLessonsPath && (
      <section className={`relative mx-auto overflow-hidden rounded-[2rem] border border-[#e7d8c3] bg-[#fffaf0] shadow-[0_24px_80px_rgba(69,46,28,0.12)] ${isMobileEnhancedPath ? `${topic}-mobile-map-frame` : ''}`}>
        <div className="scroll-path-scroll max-h-[78vh] overflow-y-auto overflow-x-hidden">
          <div className="scroll-path-artboard relative mx-auto w-full max-w-[760px]">
            <img
              src={pathConfig.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full select-none"
              draggable="false"
            />
            {isMobileEnhancedPath && (
              <>
                <div className={`${topic}-mobile-map-softener`} aria-hidden="true" />
                <div className={`${topic}-mobile-path-lane`} aria-hidden="true" />
              </>
            )}
            <svg className="pointer-events-none absolute inset-0 z-[15] h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline className={isMobileEnhancedPath ? `${topic}-path-line` : ''} points={fullLine} fill="none" stroke="rgba(115,102,82,0.28)" strokeWidth="0.42" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {activeLine && (
                <polyline className={`${isMobileEnhancedPath ? `${topic}-path-line-active ` : ''}scroll-path-shimmer`} points={activeLine} fill="none" stroke="rgba(217,65,86,0.82)" strokeWidth="0.62" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              )}
            </svg>
            {positionedLessons.map((lesson) => (
              <ScrollPathButton
                key={lesson.id}
                lesson={lesson}
                position={lesson.position}
                topic={topic}
                isSelected={selectedLesson?.id === lesson.id}
                onSelect={(nextLesson) => setSelectedLessonId(nextLesson.id)}
              />
            ))}
          </div>
        </div>
      </section>
      )}

      {isMobileEnhancedPath && currentLesson?.route && (
        <Link to={currentLesson.route} className={`${topic}-mobile-cta md:hidden`}>
          <span>
            <span>{t(`skillTree.${topic}.continue`)}</span>
            <strong>{currentTitle}</strong>
          </span>
          <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      )}

      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2f251d]/35 px-4 pb-4 pt-10 backdrop-blur-[2px] md:items-center md:p-6">
          <button
            type="button"
            aria-label={t(`skillTree.${topic}.closeLessonCard`)}
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedLessonId(null)}
          />
          <CurrentLessonCard
            lesson={selectedLesson}
            currentIndex={pathProgress.completed}
            completed={pathProgress.completed}
            total={pathProgress.total}
            className="relative z-10 w-full max-w-[24rem] rounded-b-[1.75rem] md:rounded-3xl"
            namespace={`skillTree.${topic}`}
            mode={selectedLesson.status === 'completed' ? 'review' : 'current'}
            themeId={topic}
            onClose={() => setSelectedLessonId(null)}
          />
        </div>
      )}
    </div>
  );
}

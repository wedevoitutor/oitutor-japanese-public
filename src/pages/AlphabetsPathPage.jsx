import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight, FaCheck, FaLock, FaPlay } from 'react-icons/fa';
import { useProgress } from '../context/ProgressContext';
import PathHeader from '../components/skilltree/PathHeader';
import CurrentLessonCard from '../components/skilltree/CurrentLessonCard';
import {
  alphabetsPathConfig,
  alphabetsPathPositions,
} from '../components/skilltree/alphabetsPathConfig';
import { applySequentialProgress } from '../components/skilltree/pathLayout';
import { PROGRESS_THEME } from '../components/skilltree/scrollPathConfigs';

const statusClasses = {
  completed: 'border-[#dff0d7] bg-[#74C365] text-white shadow-[0_8px_20px_rgba(116,195,101,0.35)]',
  available: 'border-[#f0dcaa] bg-[#fff4cf] text-[#5c432b] shadow-[0_8px_18px_rgba(124,84,39,0.18)]',
  locked: 'border-stone-300 bg-stone-400 text-white/80 opacity-80 grayscale',
};

function getLinePoints(positions) {
  return positions.map((position) => `${position.x},${position.y}`).join(' ');
}

function getTrackProgress(lessons) {
  return {
    completed: lessons.filter((lesson) => lesson.status === 'completed').length,
    total: lessons.length,
  };
}

function getTrackIndex(lessons, currentLesson) {
  if (!currentLesson) return 0;
  return Math.max(0, lessons.findIndex((lesson) => lesson.id === currentLesson.id));
}

function AlphabetsTreeButton({ lesson, position, isSelected, onSelect }) {
  const { t } = useTranslation();
  const title = t(lesson.titleKey);
  const stateText = t(`skillTree.alphabets.states.${lesson.status}`);
  const ariaLabel = t('skillTree.alphabets.nodeAria', { title, state: stateText });
  const isActionable = ['completed', 'current', 'available'].includes(lesson.status) && lesson.route;

  const inner = (
    <>
      <span className="block max-w-[88%] truncate text-[clamp(0.64rem,2.25vw,1.15rem)] font-black leading-none japanese-label">
        {lesson.kana}
      </span>
      {lesson.status === 'completed' && (
        <span className="absolute -right-0.5 -top-0.5 grid h-[34%] w-[34%] place-items-center rounded-full bg-white text-[#3b7a34] shadow">
          <FaCheck aria-hidden="true" className="h-[45%] w-[45%]" />
        </span>
      )}
      {lesson.status === 'current' && (
        <span className="absolute -bottom-0.5 -right-0.5 grid h-[34%] w-[34%] place-items-center rounded-full bg-[#f6c46b] text-[#7f2d1f] shadow">
          <FaPlay aria-hidden="true" className="ml-[1px] h-[40%] w-[40%]" />
        </span>
      )}
      {lesson.status === 'current' && (
        <span className="alphabets-current-label">
          {t('skillTree.alphabets.continue')}
        </span>
      )}
      {lesson.status === 'locked' && (
        <span className="absolute -right-0.5 -top-0.5 grid h-[34%] w-[34%] place-items-center rounded-full bg-[#5f5a52] text-white shadow">
          <FaLock aria-hidden="true" className="h-[42%] w-[42%]" />
        </span>
      )}
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-1 hidden w-max max-w-[9rem] -translate-x-1/2 rounded-full border border-[#ead8bd] bg-[#fffaf0]/95 px-2 py-1 text-[0.65rem] font-bold leading-tight text-[#5c432b] shadow-lg group-hover:block group-focus-visible:block">
        {title}
      </span>
    </>
  );

  const selectedClass = isSelected ? 'ring-4 ring-[#2f251d]/25' : '';
  const currentClass = lesson.status === 'current' ? `alphabets-active-node z-40 ${PROGRESS_THEME.alphabets.current}` : '';
  const statusClass = currentClass || statusClasses[lesson.status];
  const hitboxClassName = `alphabets-tree-hitbox group absolute z-30 grid -translate-x-1/2 -translate-y-1/2 place-items-center transition duration-200 ${lesson.status === 'current' ? 'z-40' : ''} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9412e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]`;
  const faceClassName = `alphabets-tree-node-face relative grid place-items-center rounded-full border font-black transition duration-200 ${statusClass} ${selectedClass} alphabets-tree-node-size group-hover:scale-105`;
  const style = { left: `${position.x}%`, top: `${position.y}%` };

  if (!isActionable) {
    return (
      <button type="button" disabled aria-label={ariaLabel} className={`${hitboxClassName} cursor-not-allowed`} style={style}>
        <span className={faceClassName} data-status={lesson.status}>
          {inner}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={`${hitboxClassName} cursor-pointer`}
      style={style}
      onClick={() => onSelect(lesson)}
    >
      <span className={faceClassName} data-status={lesson.status}>
        {inner}
      </span>
    </button>
  );
}

export default function AlphabetsPathPage() {
  const { t } = useTranslation();
  const { progress } = useProgress();
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const lessons = useMemo(
    () => applySequentialProgress(alphabetsPathConfig.lessons, progress.lessons),
    [progress.lessons],
  );
  const positionedLessons = useMemo(
    () => lessons.map((lesson, index) => ({ ...lesson, position: alphabetsPathPositions[index] })).filter((lesson) => lesson.position),
    [lessons],
  );
  const pathProgress = useMemo(() => getTrackProgress(positionedLessons), [positionedLessons]);
  const currentLesson = positionedLessons.find((lesson) => lesson.status === 'current');
  const currentIndex = getTrackIndex(positionedLessons, currentLesson);
  const selectedLesson = positionedLessons.find((lesson) => lesson.id === selectedLessonId);
  const fullLine = getLinePoints(alphabetsPathPositions);
  const activeLine = getLinePoints(alphabetsPathPositions.slice(0, Math.min(currentIndex + 1, alphabetsPathPositions.length)));
  const currentTitle = currentLesson ? t(currentLesson.titleKey) : '';

  return (
    <div className="path-fade-in mx-auto w-full max-w-5xl">
      <PathHeader
        title={t('skillTree.alphabets.title')}
        completedText={t('skillTree.alphabets.completed', pathProgress)}
        progressLabel={t('skillTree.alphabets.progressLabel')}
        completed={pathProgress.completed}
        total={pathProgress.total}
        sakuraLabel={t('skillTree.alphabets.sakuraButton')}
        themeId="alphabets"
      />

      {currentLesson && (
        <div className="alphabets-mobile-ribbon md:hidden">
          <span>{t('skillTree.alphabets.currentLesson')}</span>
          <strong>{currentTitle}</strong>
        </div>
      )}

      <section className="alphabets-mobile-map-frame relative mx-auto overflow-hidden rounded-[2rem] border border-[#e7d8c3] bg-[#fffaf0] shadow-[0_24px_80px_rgba(69,46,28,0.12)]">
        <div className="sakura-tree-scroll max-h-[78vh] overflow-y-auto overflow-x-hidden">
          <div className="alphabets-tree-artboard relative mx-auto w-full max-w-[760px]">
            <img
              src={alphabetsPathConfig.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full select-none"
              draggable="false"
            />
            <div className="alphabets-mobile-map-softener" aria-hidden="true" />
            <div className="alphabets-mobile-path-lane" aria-hidden="true" />
            <svg className="pointer-events-none absolute inset-0 z-[15] h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline className="alphabets-path-line" points={fullLine} fill="none" stroke="rgba(234,128,154,0.38)" strokeWidth="0.42" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {activeLine && (
                <polyline className="alphabets-path-line-active alphabets-path-shimmer" points={activeLine} fill="none" stroke="rgba(217,65,86,0.82)" strokeWidth="0.62" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              )}
            </svg>
            {positionedLessons.map((lesson) => (
              <AlphabetsTreeButton
                key={lesson.id}
                lesson={lesson}
                position={lesson.position}
                isSelected={selectedLesson?.id === lesson.id}
                onSelect={(nextLesson) => setSelectedLessonId(nextLesson.id)}
              />
            ))}
          </div>
        </div>

      </section>

      {currentLesson?.route && (
        <Link to={currentLesson.route} className="alphabets-mobile-cta md:hidden">
          <span>
            <span>{t('skillTree.alphabets.continue')}</span>
            <strong>{currentTitle}</strong>
          </span>
          <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      )}

      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2f251d]/35 px-4 pb-4 pt-10 backdrop-blur-[2px] md:items-center md:p-6">
          <button
            type="button"
            aria-label={t('skillTree.alphabets.closeLessonCard')}
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedLessonId(null)}
          />
          <CurrentLessonCard
            lesson={selectedLesson}
            currentIndex={pathProgress.completed}
            completed={pathProgress.completed}
            total={pathProgress.total}
            className="relative z-10 w-full max-w-[24rem] rounded-b-[1.75rem] md:rounded-3xl"
            namespace="skillTree.alphabets"
            mode={selectedLesson.status === 'completed' ? 'review' : 'current'}
            themeId="alphabets"
            onClose={() => setSelectedLessonId(null)}
          />
        </div>
      )}
    </div>
  );
}

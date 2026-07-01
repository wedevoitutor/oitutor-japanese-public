import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../../context/ProgressContext';
import { AVAILABLE_CONTENT_FILES } from '../../lib/contentLoader';
import { getSectionTheme } from '../../lib/curriculumTheme';
import LessonCard from './LessonCard';

const INITIAL_VISIBLE = 5;

export default function SectionPanel({ section, allLessonIds, isAuthenticated }) {
  const { t } = useTranslation();
  const { progress, getLessonStatus } = useProgress();
  const theme = getSectionTheme(section.id);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [section.id]);

  useEffect(() => {
    if (visibleCount >= section.lessons.length) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((v) => Math.min(v + 1, section.lessons.length));
        }
      },
      { rootMargin: '160px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, section.lessons.length]);

  const done = section.lessons.filter((l) => progress.lessons[l.id]?.completed).length;
  const total = section.lessons.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const displayed = section.lessons.slice(0, visibleCount);
  const hasMore = visibleCount < total;

  return (
    <div key={section.id} className="card-entrance">
      <header className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.gradient} text-white p-4 sm:p-6 mb-5 sm:mb-6 shadow-lg`}>
        <span
          className="absolute -right-2 -bottom-6 text-[5rem] sm:-right-4 sm:-bottom-10 sm:text-[9rem] font-black leading-none opacity-10 select-none pointer-events-none tracking-tighter"
          aria-hidden="true"
        >
          {section.titleJp}
        </span>
        <div className="relative z-10">
          <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mb-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{section.titleJp}</span>
            <h2 className="text-base sm:text-xl font-bold">
              {t(`sections.${section.id}.title`)}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/85 mb-3 sm:mb-4 max-w-2xl">
            {t(`sections.${section.id}.description`)}
          </p>
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="font-mono tabular-nums text-white/90 shrink-0">
              {done}/{total}
            </span>
            <div className="flex-1 max-w-sm h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono tabular-nums font-semibold shrink-0">{pct}%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {displayed.map((lesson, i) => {
          const effectiveLesson =
            !lesson.comingSoon && lesson.contentFile && !AVAILABLE_CONTENT_FILES.has(lesson.contentFile)
              ? { ...lesson, comingSoon: true }
              : lesson;
          const authLocked =
            !effectiveLesson.comingSoon && !isAuthenticated && allLessonIds.indexOf(lesson.id) > 0;
          return (
            <LessonCard
              key={lesson.id}
              lesson={effectiveLesson}
              sectionSlug={section.slug}
              authLocked={authLocked}
              index={i < INITIAL_VISIBLE ? i : 0}
              theme={theme}
              status={
                effectiveLesson.comingSoon
                  ? 'locked'
                  : authLocked
                    ? 'locked'
                    : getLessonStatus(lesson.id, allLessonIds)
              }
            />
          );
        })}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="h-8 flex items-center justify-center mt-2" aria-hidden="true">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}

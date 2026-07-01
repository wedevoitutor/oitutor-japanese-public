import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSections, useAllLessonIds, usePlannedLessonCount } from '../hooks/useLesson';
import { useSession } from '../hooks/useSession';
import { useProgress } from '../context/ProgressContext';
import { getSectionTheme } from '../lib/curriculumTheme';
import SectionNav from '../components/course/SectionNav';
import SectionPanel from '../components/course/SectionPanel';
import BackLink from '../components/layout/BackLink';

export default function CoursePage() {
  const { t } = useTranslation();
  const sections = useSections();
  const allLessonIds = useAllLessonIds();
  const plannedLessonCount = usePlannedLessonCount();
  const session = useSession();
  const { progress } = useProgress();
  const isAuthenticated = !!session;

  const [activeId, setActiveId] = useState(sections[0]?.id);
  const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];
  const activeTheme = getSectionTheme(activeSection?.id);

  const totalDone = useMemo(
    () => allLessonIds.filter((id) => progress.lessons[id]?.completed).length,
    [allLessonIds, progress.lessons],
  );

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${activeTheme.pageBg}`}>
      <span
        className={`hidden md:inline absolute top-32 -left-6 text-[12rem] lg:text-[14rem] font-black select-none pointer-events-none rotate-12 transition-colors duration-500 ${activeTheme.watermarkColor}`}
        aria-hidden="true"
      >
        {activeTheme.watermarkKanji[0]}
      </span>
      <span
        className={`hidden md:inline absolute bottom-20 -right-8 text-[10rem] lg:text-[12rem] font-black select-none pointer-events-none -rotate-6 transition-colors duration-500 ${activeTheme.watermarkColor}`}
        aria-hidden="true"
      >
        {activeTheme.watermarkKanji[1]}
      </span>

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <BackLink to="/" label={t('course.backToLanguages')} className="" />
            <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1 min-w-0">
              <span className={`text-sm sm:text-lg font-extrabold tracking-tight shrink-0 transition-colors ${activeTheme.titleJp}`}>
                日本語
              </span>
              <h1 className="text-sm sm:text-lg font-semibold text-slate-900 truncate">
                {t('course.title')}
              </h1>
            </div>
          </div>
          <div className="text-right shrink-0 self-end sm:self-center">
            <div className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-wider">Progress</div>
            <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 leading-none">
              {totalDone}<span className="text-slate-400">/{plannedLessonCount}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 sm:gap-8 lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <SectionNav sections={sections} activeId={activeId} onSelect={setActiveId} />
        </aside>

        <main className="min-w-0">
          {activeSection && (
            <SectionPanel
              key={activeSection.id}
              section={activeSection}
              allLessonIds={allLessonIds}
              isAuthenticated={isAuthenticated}
            />
          )}
        </main>
      </div>
    </div>
  );
}

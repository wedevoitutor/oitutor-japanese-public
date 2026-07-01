import { useTranslation } from 'react-i18next';
import { useProgress } from '../../context/ProgressContext';
import { getSectionTheme } from '../../lib/curriculumTheme';

function getSectionStats(lessons, progress) {
  const total = lessons.length;
  const done = lessons.filter((l) => progress.lessons[l.id]?.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function ArrowButton({ onClick, label, direction, accentClass }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all ${accentClass}`}
    >
      <svg className="w-4 h-4 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  );
}

export default function SectionNav({ sections, activeId, onSelect }) {
  const { t } = useTranslation();
  const { progress } = useProgress();

  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === activeId));
  const activeSection = sections[activeIndex];
  const activeTheme = getSectionTheme(activeSection.id);
  const active = getSectionStats(activeSection.lessons, progress);

  const goPrev = () => onSelect(sections[(activeIndex - 1 + sections.length) % sections.length].id);
  const goNext = () => onSelect(sections[(activeIndex + 1) % sections.length].id);

  return (
    <>
      {/* Mobile + tablet: centered card with prev/next + dot indicator */}
      <div className="lg:hidden">
        <div className="flex items-center gap-1">
          <ArrowButton onClick={goPrev} label={t('course.prevSection')} direction="left" accentClass={activeTheme.accent} />
          <div
            key={activeSection.id}
            className={`card-entrance flex-1 min-w-0 flex items-center gap-3 px-4 py-3 rounded-xl ${activeTheme.navActive}`}
          >
            <span className={`text-base font-bold tracking-tight shrink-0 ${activeTheme.titleJp}`}>
              {activeSection.titleJp}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">
                {t(`sections.${activeSection.id}.title`)}
              </div>
              <div className="mt-1 h-1 bg-black/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-[width] duration-500 ${activeTheme.progress}`}
                  style={{ width: `${active.pct}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] font-mono tabular-nums shrink-0 opacity-70">
              {active.done}/{active.total}
            </span>
          </div>
          <ArrowButton onClick={goNext} label={t('course.nextSection')} direction="right" accentClass={activeTheme.accent} />
        </div>

        <div className="flex justify-center gap-1.5 mt-3">
          {sections.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                aria-label={t(`sections.${s.id}.title`)}
                aria-current={isActive ? 'page' : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  isActive ? `w-6 ${activeTheme.progress}` : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop: sidebar list */}
      <nav className="hidden lg:flex lg:flex-col gap-1" aria-label={t('course.title')}>
        {sections.map((s) => {
          const stats = getSectionStats(s.lessons, progress);
          const isActive = s.id === activeId;
          const theme = getSectionTheme(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? theme.navActive : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span
                className={`text-sm font-bold tracking-tight shrink-0 ${isActive ? theme.titleJp : 'text-slate-400'}`}
              >
                {s.titleJp}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {t(`sections.${s.id}.title`)}
                </div>
                <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-[width] duration-500 ${isActive ? theme.progress : 'bg-slate-300'}`}
                    style={{ width: `${stats.pct}%` }}
                  />
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono tabular-nums shrink-0">
                {stats.done}/{stats.total}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

import { Link } from 'react-router-dom';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { PROGRESS_THEME } from './scrollPathConfigs';

export default function CurrentLessonCard({
  lesson,
  currentIndex,
  completed,
  total,
  className = '',
  namespace = 'skillTree.hiragana',
  mode = 'current',
  themeId = 'alphabets',
  onClose,
}) {
  const { t } = useTranslation();
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const theme = PROGRESS_THEME[themeId] ?? PROGRESS_THEME.alphabets;

  if (!lesson) return null;

  const titleKey = lesson.titleKey ?? lesson.title;
  const title = t(titleKey, { defaultValue: lesson.title ?? titleKey });
  const isReview = mode === 'review';

  return (
    <aside className={`rounded-3xl border border-[#ead8bd] bg-[#fffaf0]/95 p-4 text-[#2f251d] shadow-[0_18px_50px_rgba(69,46,28,0.16)] backdrop-blur ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c84a5f]">
            {t(`${namespace}.${isReview ? 'reviewLesson' : 'currentLesson'}`)}
          </p>
          <h3 className="mt-2 text-base font-black leading-snug">
            {isReview ? t(`${namespace}.reviewPrompt`, { title }) : title}
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            aria-label={t(`${namespace}.closeLessonCard`)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#ead8bd] bg-white/70 text-[#806b55] transition hover:bg-white hover:text-[#2f251d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9412e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]"
            onClick={onClose}
          >
            <FaTimes aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-[#806b55]">
        <span>{t(`${namespace}.lessonPosition`, { current: currentIndex, total })}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eadfcf]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-[width] duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <Link
        to={lesson.route}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f251d] px-4 py-2.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(47,37,29,0.18)] transition hover:-translate-y-0.5 hover:bg-[#4a3728] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9412e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]"
      >
        {t(`${namespace}.continue`)}
        <FaArrowRight aria-hidden="true" className="h-3 w-3" />
      </Link>
    </aside>
  );
}

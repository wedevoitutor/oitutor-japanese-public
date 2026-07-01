import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TYPE_LABEL = {
  study:    'Study',
  practice: 'Practice',
  grammar:  'Grammar',
  dialogue: 'Dialogue',
  kanji:    'Kanji',
  review:   'Review',
};

const NEUTRAL_THEME = {
  cardBg: 'bg-white',
  cardBorder: 'border-slate-200',
  cardHover: 'hover:border-red-300 hover:shadow-md',
  typeLabel: 'text-slate-500',
  cta: 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow-md hover:shadow-red-500/30',
  ctaCompleted: 'bg-slate-100 text-slate-700 hover:bg-slate-200 ring-1 ring-slate-200/60',
  ctaLocked: 'border-slate-200 text-slate-700 hover:bg-slate-50',
};

export default function LessonCard({ lesson, sectionSlug, status, authLocked = false, index = 0, theme = NEUTRAL_THEME }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const typeLabel = TYPE_LABEL[lesson.type] ?? 'Lesson';

  const ctaLabel =
    lesson.type === 'review' ? t('course.ultimateReview')
    : lesson.type === 'practice' ? t('course.startPractice')
    : isCompleted ? t('course.openLesson')
    : t('course.startLesson');

  const cardClasses = isLocked
    ? 'bg-slate-50/60 border-slate-200 opacity-70'
    : `${theme.cardBg} ${theme.cardBorder} ${theme.cardHover} hover:shadow-md`;

  return (
    <article
      className={`card-entrance group relative flex flex-col rounded-lg border transition-all ${cardClasses}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex-1 p-3 sm:p-4">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${isLocked ? 'text-slate-400' : theme.typeLabel}`}>
            {typeLabel}
          </span>
          {isCompleted && (
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="completed">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1">
          {t(lesson.title)}
        </h3>

        {lesson.description && (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {t(lesson.description)}
          </p>
        )}

        {lesson.meta?.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
            {lesson.meta.map((m) => t(m)).join(' · ')}
          </p>
        )}
      </div>

      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        {isLocked ? (
          authLocked ? (
            <Link
              to="/login"
              className={`w-full block text-center py-2 text-xs font-semibold border rounded-md transition-colors ${theme.ctaLocked}`}
            >
              {t('course.loginToUnlock')}
            </Link>
          ) : (
            <div className="w-full text-center py-2 text-xs font-medium text-slate-400 border border-slate-100 rounded-md">
              {lesson.comingSoon ? t('course.comingSoon') : t('course.locked')}
            </div>
          )
        ) : (
          <button
            onClick={() => navigate(`/curriculum/${sectionSlug}/${lesson.slug}`)}
            className={`group/cta w-full py-2 text-xs font-semibold rounded-md transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] inline-flex items-center justify-center gap-1.5 ${isCompleted ? theme.ctaCompleted : theme.cta}`}
          >
            <span>{ctaLabel}</span>
            <svg className="w-3 h-3 transition-transform group-hover/cta:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}

import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProgressBar from '../ui/ProgressBar';

const navBtn =
  'w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-colors';

export default function ExerciseShell({
  current,
  total,
  children,
  onBack,
  onForward,
  canBack = false,
  canForward = false,
}) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          disabled={!canBack}
          className={navBtn}
          aria-label="Previous exercise"
        >
          <FaChevronLeft />
        </button>
        <ProgressBar current={current} total={total} className="flex-1" />
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
          {current} {t('exercise.of')} {total}
        </span>
        <button
          type="button"
          onClick={onForward}
          disabled={!canForward}
          className={navBtn}
          aria-label="Next exercise"
        >
          <FaChevronRight />
        </button>
      </div>
      {children}
    </div>
  );
}

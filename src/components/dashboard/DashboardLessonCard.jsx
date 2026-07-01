import { useTranslation } from 'react-i18next';
import PlaquePanel from '../ui/PlaquePanel';

const TYPE_STYLE = {
  exercise: { bg: 'bg-[#ede5ff] text-[#3a2566] border-[#d9c8ff]', icon: '書' },
  revision: { bg: 'bg-[#fbf7ec] text-[#c03a2b] border-[#d9cfbb]', icon: '復' },
  material: { bg: 'bg-[#f6f1e6] text-[#3a6b3a] border-[#d9cfbb]', icon: '読' },
};

const FALLBACK = { bg: 'bg-[#f6f1e6] text-[#4a4038] border-[#d9cfbb]', icon: '文' };

/**
 * Single lesson card with wood-grain style, hanko stamp, and XP pop.
 * @param {{ assignment: object, onToggle: function, index: number, showXpPop: boolean }} props
 */
export default function DashboardLessonCard({ assignment, onToggle, index, showXpPop }) {
  const { t } = useTranslation();
  const { lesson, completed, id } = assignment;
  const type = TYPE_STYLE[lesson?.lesson_type] ?? FALLBACK;

  return (
    <PlaquePanel index={index} className="p-4 md:p-5">
      {completed && (
        <div className="absolute top-3 right-3 hanko-stamp">
          <span className="inline-flex h-8 w-8 md:h-9 md:w-9 rotate-[-4deg] items-center justify-center rounded-full border-2 border-[#9a2e21] bg-[#c03a2b] font-serif text-lg md:text-xl font-semibold text-[#fdf3d9] shadow-[inset_0_0_0_2px_rgba(253,243,217,0.25)]">正</span>
        </div>
      )}

      {showXpPop && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 xp-float">
          <span className="text-sm font-bold text-[#6d28d9] font-mono">+XP</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm md:text-base font-serif text-[#6d28d9]">{type.icon}</span>
        <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 border uppercase tracking-[0.1em] font-mono ${type.bg}`}>
          {lesson?.lesson_type}
        </span>
      </div>

      <h3 className={`font-semibold text-sm md:text-base mt-1 mb-1 font-serif ${completed ? 'text-[#8a7f72] line-through' : 'text-[#1a1613]'}`}>
        {lesson?.title}
      </h3>
      <p className="text-xs md:text-sm text-[#4a4038] mb-3 md:mb-4 line-clamp-2">{lesson?.description}</p>

      <div className="flex gap-2">
        <a
          href={lesson?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs md:text-sm font-semibold bg-[#1a1613] hover:bg-[#6d28d9] text-[#f6f1e6] py-2 shadow-md shadow-[#1a1613]/15 transition-all duration-200 uppercase tracking-[0.08em]"
        >
          {t('portal.openLesson')}
        </a>
        <button
          onClick={() => onToggle(id, completed)}
          title={completed ? t('portal.markIncomplete') : t('portal.markComplete')}
          className={`px-2.5 md:px-3 py-2 border text-sm font-bold transition-all duration-200 ${
            completed
              ? 'border-[#d9cfbb] text-[#8a7f72] hover:border-[#c03a2b] hover:text-[#c03a2b]'
              : 'border-[#3a6b3a] text-[#3a6b3a] hover:bg-[#f6f1e6] hover:scale-110'
          }`}
        >
          {completed ? '↩' : '✓'}
        </button>
      </div>
    </PlaquePanel>
  );
}

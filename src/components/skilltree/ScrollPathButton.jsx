import { useTranslation } from 'react-i18next';
import { FaCheck, FaLock, FaPlay } from 'react-icons/fa';
import { PROGRESS_THEME } from './scrollPathConfigs';

const statusClasses = {
  completed: 'border-[#dff0d7] bg-[#74C365] text-white shadow-[0_8px_20px_rgba(116,195,101,0.35)]',
  available: 'border-[#f0dcaa] bg-[#fff4cf] text-[#5c432b] shadow-[0_8px_18px_rgba(124,84,39,0.18)]',
  locked: 'border-stone-300 bg-stone-400 text-white/80 opacity-80 grayscale',
};

const nodeSizeClasses = {
  kanji: 'kanji-scroll-node-size',
  lessons: 'lessons-scroll-node-size',
  grammar: 'grammar-scroll-node-size',
};

const labelClasses = {
  kanji: 'text-[clamp(0.8rem,2.5cqw,1.45rem)]',
  lessons: 'text-[clamp(0.44rem,1.35cqw,0.78rem)]',
  grammar: 'text-[clamp(0.5rem,1.75cqw,0.95rem)]',
};

/**
 * Renders one positioned node for scroll-style skill paths.
 *
 * @param {object} props
 * @param {object} props.lesson - Lesson view model after sequential progress is applied.
 * @param {object} props.position - Percent-based node center coordinates.
 * @param {string} props.topic - Skill tree topic id.
 * @param {boolean} props.isSelected - Whether this node owns the open card.
 * @param {(lesson: object) => void} props.onSelect - Selection callback.
 */
export default function ScrollPathButton({ lesson, position, topic, isSelected, onSelect }) {
  const { t } = useTranslation();
  const titleKey = lesson.titleKey ?? lesson.title;
  const title = t(titleKey, { defaultValue: lesson.title ?? titleKey });
  const stateText = t(`skillTree.${topic}.states.${lesson.status}`);
  const ariaLabel = t(`skillTree.${topic}.nodeAria`, { title, state: stateText });
  const isActionable = ['completed', 'current', 'available'].includes(lesson.status) && lesson.route;
  const selectedClass = isSelected ? 'ring-4 ring-[#2f251d]/25' : '';
  const currentClass = lesson.status === 'current' ? `scroll-active-node z-40 ${PROGRESS_THEME[topic].current}` : '';
  const statusClass = currentClass || statusClasses[lesson.status];
  const hitboxClassName = `${topic}-scroll-hitbox scroll-path-node-hitbox group absolute z-30 grid -translate-x-1/2 -translate-y-1/2 place-items-center transition duration-200 ${lesson.status === 'current' ? 'z-40' : ''} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9412e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]`;
  const faceClassName = `scroll-path-node-face relative grid place-items-center rounded-full border font-black transition duration-200 ${statusClass} ${selectedClass} ${nodeSizeClasses[topic]} group-hover:scale-105`;
  const style = { left: `${position.x}%`, top: `${position.y}%` };

  const inner = (
    <>
      <span className={`block max-w-[92%] truncate font-black leading-none japanese-label ${labelClasses[topic]}`}>
        {lesson.kana}
      </span>
      {lesson.status === 'completed' && (
        <span className="absolute -right-0.5 -top-0.5 grid h-[34%] w-[34%] place-items-center rounded-full bg-white text-[#5f7f5a] shadow">
          <FaCheck aria-hidden="true" className="h-[45%] w-[45%]" />
        </span>
      )}
      {lesson.status === 'current' && (
        <span className="absolute -bottom-0.5 -right-0.5 grid h-[34%] w-[34%] place-items-center rounded-full bg-[#f6c46b] text-[#7f2d1f] shadow">
          <FaPlay aria-hidden="true" className="ml-[1px] h-[40%] w-[40%]" />
        </span>
      )}
      {(topic === 'kanji' || topic === 'grammar') && lesson.status === 'current' && (
        <span className={`${topic}-current-label`}>
          {t(`skillTree.${topic}.continue`)}
        </span>
      )}
      {lesson.status === 'locked' && (
        <span className="absolute -right-0.5 -top-0.5 grid h-[34%] w-[34%] place-items-center rounded-full bg-[#5f5a52] text-white shadow">
          <FaLock aria-hidden="true" className="h-[42%] w-[42%]" />
        </span>
      )}
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-1 hidden w-max max-w-[10rem] -translate-x-1/2 rounded-full border border-[#ead8bd] bg-[#fffaf0]/95 px-2 py-1 text-[0.65rem] font-bold leading-tight text-[#5c432b] shadow-lg group-hover:block group-focus-visible:block">
        {title}
      </span>
    </>
  );

  if (!isActionable) {
    return (
      <button type="button" disabled aria-label={ariaLabel} className={`${hitboxClassName} cursor-not-allowed`} style={style}>
        <span className={faceClassName} data-topic={topic} data-status={lesson.status}>
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
      <span className={faceClassName} data-topic={topic} data-status={lesson.status}>
        {inner}
      </span>
    </button>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaClock, FaLock, FaPlay } from 'react-icons/fa';
import { isActionableLesson } from './lessonMobilePathUtils';

/**
 * One mobile Lessons map node with a large touch target and compact visible circle.
 *
 * @param {object} props
 * @param {object} props.node - Positioned chapter node.
 * @param {(message: string) => void} props.onLocked - Locked-node feedback callback.
 */
export default function LessonsMobileNode({ node, onLocked }) {
  const { t } = useTranslation();
  const { lesson } = node;
  const titleKey = lesson.titleKey ?? lesson.title;
  const title = t(titleKey, { defaultValue: lesson.title ?? titleKey });
  const stateText = t(`skillTree.lessons.states.${lesson.status}`);
  const ariaLabel = t('skillTree.lessons.nodeAria', { title, state: stateText });
  const isActionable = isActionableLesson(lesson);
  const style = { left: `${node.x}%`, top: `${node.y}%` };

  const face = (
    <span className="lessons-mobile-node-face" data-status={lesson.status}>
      <span className="lessons-mobile-node-label japanese-label">{lesson.kana}</span>
      {lesson.status === 'completed' && (
        <span className="lessons-mobile-node-badge is-completed">
          <FaCheck aria-hidden="true" />
        </span>
      )}
      {lesson.status === 'current' && (
        <>
          <span className="lessons-mobile-node-ring" aria-hidden="true" />
          <span className="lessons-mobile-node-badge is-current">
            <FaPlay aria-hidden="true" />
          </span>
        </>
      )}
      {lesson.status === 'locked' && (
        <span className="lessons-mobile-node-badge is-locked">
          {lesson.lessonId ? <FaLock aria-hidden="true" /> : <FaClock aria-hidden="true" />}
        </span>
      )}
    </span>
  );

  if (!isActionable) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        className="lessons-mobile-node-hitbox"
        style={style}
        onClick={() => onLocked(t('skillTree.lessons.chapters.lockedFeedback'))}
      >
        {face}
      </button>
    );
  }

  return (
    <Link to={lesson.route} aria-label={ariaLabel} className="lessons-mobile-node-hitbox" style={style}>
      {face}
    </Link>
  );
}

import { useTranslation } from 'react-i18next';
import LessonsMobileNode from './LessonsMobileNode';
import { getChapterNodes } from './lessonMobilePathUtils';

function isCompletedConnection(fromNode, toNode) {
  return fromNode.lesson.status === 'completed' && ['completed', 'current', 'available'].includes(toNode.lesson.status);
}

function getDebugLessonNodesEnabled() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('debugLessonNodes') === '1' || window.localStorage.getItem('debugLessonNodes') === '1';
}

function getFloatingLabelStyle(node) {
  const shouldPlaceLeft = !node.labelX && node.x > 62;
  const x = node.labelX ?? (shouldPlaceLeft ? node.x - 5 : Math.min(78, node.x + 13));
  const y = node.labelY ?? Math.min(96, node.y + 2.8);

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: shouldPlaceLeft ? 'translate(-100%, -50%)' : 'translateY(-50%)',
  };
}

/**
 * One mobile Lessons chapter map panel.
 *
 * @param {object} props
 * @param {object} props.chapter - Mobile chapter config.
 * @param {object[]} props.lessons - Progress-decorated lessons.
 * @param {string} props.image - Decorative map image URL.
 * @param {(message: string) => void} props.onLocked - Locked-node feedback callback.
 * @param {'mobile'|'desktop'} [props.variant] - Layout variant.
 */
export default function LessonsMapPanel({ chapter, lessons, image, onLocked, variant = 'mobile' }) {
  const { t } = useTranslation();
  const nodes = getChapterNodes(chapter, lessons);
  const currentNode = nodes.find((node) => node.lesson.status === 'current');
  const debugNodes = getDebugLessonNodesEnabled();
  const label = t('skillTree.lessons.chapters.panelLabel', {
    label: t(chapter.labelKey),
    title: t(chapter.titleKey),
  });

  return (
    <section className={`lessons-map-panel lessons-map-panel-${variant} ${debugNodes ? 'is-debugging-nodes' : ''}`} aria-label={label}>
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="lessons-map-image"
        style={{ objectPosition: chapter.backgroundPosition }}
        draggable="false"
      />
      <div className="lessons-map-softener" aria-hidden="true" />
      <div className="lessons-map-lane" aria-hidden="true" />

      <svg className="lessons-map-lines" aria-hidden="true">
        {nodes.slice(0, -1).map((node, index) => {
          const next = nodes[index + 1];

          return (
            <line
              key={`${node.lessonNumber}-${next.lessonNumber}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              className={isCompletedConnection(node, next) ? 'is-completed' : ''}
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <LessonsMobileNode key={node.lessonNumber} node={node} onLocked={onLocked} />
      ))}

      {currentNode && (
        <span className="lessons-current-label" style={getFloatingLabelStyle(currentNode)}>
          {t('skillTree.lessons.continue')}
        </span>
      )}
    </section>
  );
}

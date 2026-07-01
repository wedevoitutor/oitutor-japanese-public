import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';

/**
 * Fixed mobile Continue action for the current Lessons path lesson.
 *
 * @param {object} props
 * @param {object} [props.lesson] - Current lesson view model.
 * @param {number} props.lessonNumber - Current lesson number.
 */
export default function LessonsStickyCta({ lesson, lessonNumber }) {
  const { t } = useTranslation();
  const label = t('skillTree.lessons.chapters.continueLesson', { number: lessonNumber });

  if (!lesson?.route) {
    return (
      <div className="lessons-sticky-cta-wrap">
        <button type="button" className="lessons-sticky-cta" disabled>
          <span>{label}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="lessons-sticky-cta-wrap">
      <Link to={lesson.route} className="lessons-sticky-cta">
        <span>{label}</span>
        <FaArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

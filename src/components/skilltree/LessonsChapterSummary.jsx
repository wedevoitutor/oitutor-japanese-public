import { useTranslation } from 'react-i18next';
import { getChapterProgress } from './lessonMobilePathUtils';

/**
 * Small mobile summary for the currently selected Lessons chapter.
 *
 * @param {object} props
 * @param {object} props.chapter - Active chapter config.
 * @param {object[]} props.lessons - Progress-decorated lessons.
 */
export default function LessonsChapterSummary({ chapter, lessons }) {
  const { t } = useTranslation();
  const [start, end] = chapter.lessonRange;
  const chapterProgress = getChapterProgress(chapter, lessons);

  return (
    <div className="lessons-chapter-summary">
      <h2>
        {t('skillTree.lessons.chapters.heading', {
          label: t(chapter.labelKey),
          title: t(chapter.titleKey),
        })}
      </h2>
      <p>
        {t('skillTree.lessons.chapters.rangeProgress', {
          start,
          end,
          completed: chapterProgress.completed,
          total: chapterProgress.total,
        })}
      </p>
    </div>
  );
}

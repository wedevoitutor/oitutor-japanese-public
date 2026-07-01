import { useTranslation } from 'react-i18next';

/**
 * Mobile chapter selector for the Lessons path.
 *
 * @param {object} props
 * @param {object[]} props.chapters - Mobile chapter configs.
 * @param {number} props.activeChapterIndex - Currently visible chapter index.
 * @param {(index: number) => void} props.onChange - Tab selection callback.
 */
export default function LessonsChapterTabs({ chapters, activeChapterIndex, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="lessons-chapter-tabs" role="tablist" aria-label={t('skillTree.lessons.chapters.tabList')}>
      {chapters.map((chapter, index) => {
        const isActive = index === activeChapterIndex;

        return (
          <button
            key={chapter.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? 'is-active' : ''}
            onClick={() => onChange(index)}
          >
            {t(chapter.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

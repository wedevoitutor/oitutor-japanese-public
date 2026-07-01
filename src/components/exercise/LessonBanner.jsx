import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useProgress } from '../../context/ProgressContext';
import { SKILL_PATHS } from '../../data/skillTreePaths';
import PathCard from '../skilltree/PathCard';
import ConfirmDialog from '../ui/ConfirmDialog';

/**
 * Full-width banner shown at the top of a themed lesson page.
 * - Left: icon-only back arrow → opens confirm dialog before leaving.
 * - Center: the skill-tree path card for the section the student is in.
 *
 * @param {object} props
 * @param {string} props.lessonId  Current lesson id (used to locate the path).
 * @param {string} props.backTo    Target route when the student confirms.
 */
export default function LessonBanner({ lessonId, backTo }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const path = SKILL_PATHS.find((p) => p.skills.some((s) => s.lessonId === lessonId));
  if (!path) return null;

  const done = path.skills.filter((s) => s.lessonId && progress.lessons[s.lessonId]?.completed).length;
  const total = path.skills.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <>
      {/* Edge-to-edge bar: card spans full viewport width at every breakpoint,
          back arrow overlays it on the top-left. */}
      <div className="relative w-full pt-4 pb-6">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label={t('exercise.backToCourse')}
          title={t('exercise.backToCourse')}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/45 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Flat corners so the bar is truly edge-to-edge */}
        <div className="[&>div]:rounded-none">
          <PathCard path={path} pct={pct} done={done} total={total} center />
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t('exercise.backConfirmTitle')}
        message={
          <Trans
            i18nKey="exercise.backConfirmMessage"
            components={{ hl: <span className="font-bold text-red-600" /> }}
          />
        }
        confirmLabel={t('exercise.yesGoBack')}
        cancelLabel={t('exercise.cancel')}
        onConfirm={() => navigate(backTo)}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

import { useProgress } from '../../context/ProgressContext';
import { useSession } from '../../hooks/useSession';

export default function XPDisplay() {
  const session = useSession();
  const { progress, levelProgress } = useProgress();
  if (!session) return null;
  if (!progress.xp) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2l2.39 4.84L17.5 7.6l-3.75 3.66.89 5.17L10 13.77l-4.64 2.66.89-5.17L2.5 7.6l5.11-.76L10 2z" />
      </svg>
      Lv.{levelProgress.currentLevel} | {progress.xp} XP
    </span>
  );
}

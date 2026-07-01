import { useProgress } from '../../context/ProgressContext';
import { useSession } from '../../hooks/useSession';

export default function StreakDisplay() {
  const session = useSession();
  const { progress } = useProgress();
  if (!session) return null;
  if (!progress.streak.count) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
      <span>🔥</span>
      {progress.streak.count}
    </span>
  );
}

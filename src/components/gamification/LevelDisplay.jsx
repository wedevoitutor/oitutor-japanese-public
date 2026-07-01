import { useProgress } from '../../context/ProgressContext';
import { useSession } from '../../hooks/useSession';

export default function LevelDisplay() {
  const session = useSession();
  const { levelProgress } = useProgress();
  if (!session) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-extrabold text-red-700">
          Lv.{levelProgress.currentLevel}
        </span>
      </div>
      <div className="w-12 bg-slate-200 rounded-full h-1">
        <div
          className="bg-red-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${levelProgress.progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

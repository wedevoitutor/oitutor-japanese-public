import { useTranslation } from 'react-i18next';
import { useProgress } from '../../context/ProgressContext';
import { useSession } from '../../hooks/useSession';

/** Level, XP, and streak lantern — always visible, compact on mobile. */
export default function StatsBar() {
  const { t } = useTranslation();
  const session = useSession();
  const { progress, levelProgress } = useProgress();
  const streak = progress.streak?.count ?? 0;
  if (!session) return null;

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <StatCard label={t('portal.level')} value={levelProgress.currentLevel} accent="text-[#6d28d9]">
        <div className="w-10 md:w-12 bg-[#d9cfbb] h-1 md:h-1.5 mt-1">
          <div
            className="bg-[#7c3aed] h-full transition-all duration-500"
            style={{ width: `${levelProgress.progressPercentage}%` }}
          />
        </div>
      </StatCard>

      <StatCard label={t('portal.xpLabel')} value={progress.xp} accent="text-[#1a1613]" />

      {streak > 0 && (
        <div className={`flex flex-col items-center bg-[#fbf7ec] px-2 md:px-3 py-1.5 md:py-2 border border-[#d9cfbb] shadow-sm ${streak >= 7 ? 'lantern-glow' : ''}`}>
          <span className="text-base md:text-xl flame-flicker">🏮</span>
          <span className="text-[10px] md:text-xs font-bold text-[#6d28d9]">{streak}</span>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent, children }) {
  return (
    <div className="bg-[#fbf7ec] px-2 md:px-3 py-1.5 md:py-2 border border-[#d9cfbb] shadow-sm text-center">
      <p className="text-[10px] md:text-xs text-[#8a7f72] font-mono uppercase tracking-[0.12em]">{label}</p>
      <p className={`text-sm md:text-lg font-extrabold ${accent}`}>{value}</p>
      {children}
    </div>
  );
}

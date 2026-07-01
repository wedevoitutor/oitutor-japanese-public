import { useProgress } from '../../context/ProgressContext';
import { SKILL_PATHS } from '../../data/skillTreePaths';
import PathCard from './PathCard';
import { getPathProgressSummary, isVisiblePathComplete } from './skillTreeProgress';

export default function PathOverviewStrip({ activeId, onSelect, className = '' }) {
  const { progress } = useProgress();

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      {SKILL_PATHS.map((p) => {
        const { done, total, pct } = getPathProgressSummary(p, progress.lessons);
        const locked = p.prereqs?.some((id) => !isVisiblePathComplete(SKILL_PATHS.find((x) => x.id === id), progress.lessons)) ?? false;
        const active = activeId === p.id;
        const shared = 'block rounded-2xl transition-all duration-300';
        const activeCls = active ? 'ring-2 ring-white/70 scale-[1.03]' : 'opacity-85 hover:opacity-100 hover:-translate-y-1';
        const card = <PathCard path={p} pct={pct} done={done} total={total} locked={locked} />;

        return onSelect ? (
          <button key={p.id} onClick={() => onSelect(p.id)} className={`${shared} ${activeCls}`}>
            {card}
          </button>
        ) : (
          <div key={p.id} className={shared}>
            {card}
          </div>
        );
      })}
    </div>
  );
}

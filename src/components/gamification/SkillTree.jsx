import { useProgress } from '../../context/ProgressContext';

export default function SkillTree({ paths }) {
  const { progress } = useProgress();

  return (
    <div className="flex flex-col items-center gap-2 py-8">
      {paths.map((path) => {
        const total = path.skills.length;
        const done = path.skills.filter(
          (s) => s.lessonId && progress.lessons[s.lessonId]?.completed,
        ).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <div key={path.id} className="flex items-center gap-3 w-full max-w-md">
            <span className="text-2xl font-semibold w-12 text-center text-[#1a1613] font-serif">{path.titleJp}</span>
            <div className="flex-1 bg-[#d9cfbb] h-3">
              <div
                className="bg-[#7c3aed] h-3 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-[#8a7f72] w-16 text-right font-mono">
              {done}/{total}
            </span>
          </div>
        );
      })}
    </div>
  );
}

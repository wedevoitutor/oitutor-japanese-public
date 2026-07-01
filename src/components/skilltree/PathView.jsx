import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../../context/ProgressContext';
import SkillNode from './SkillNode';

const ZIGZAG = ['', 'zigzag-right', '', 'zigzag-left'];

export default function PathView({ path, isPathLocked = false }) {
  const { t } = useTranslation();
  const { progress } = useProgress();
  const { skills } = path;

  const lessonSequence = useMemo(
    () => [...new Set(skills.map((s) => s.lessonId).filter(Boolean))],
    [skills],
  );

  const getSkillStatus = (skill) => {
    if (isPathLocked) return 'locked';
    if (!skill.lessonId) return 'comingSoon';
    if (progress.lessons[skill.lessonId]?.completed) return 'completed';
    const idx = lessonSequence.indexOf(skill.lessonId);
    if (idx === 0) return 'available';
    if (progress.lessons[lessonSequence[idx - 1]]?.completed) return 'available';
    return 'locked';
  };

  const total = skills.length;
  const done = skills.filter((s) => s.lessonId && progress.lessons[s.lessonId]?.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="path-fade-in max-w-[420px] mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
      {isPathLocked && (
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-center gap-2 text-sm text-amber-700 font-semibold">
          🔒 Complete <span className="font-bold">Alphabets</span> to unlock this path
        </div>
      )}

      {/* Progress header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">{t('skilltree.progress')}</span>
          <span className="text-sm font-bold text-red-600">{done}/{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full"
              style={{ width: `${pct}%`, transition: 'width 0.7s cubic-bezier(0.34,1.56,0.64,1)' }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-400">{pct}%</span>
        </div>
      </div>

      {/* Skill tree — zigzag path */}
      <div className="px-6 py-10 bg-gradient-to-b from-slate-50/50 to-slate-100/50 flex flex-col items-center overflow-y-auto max-h-[65vh]">
        {skills.map((skill, i) => {
          const status = getSkillStatus(skill);
          const prevStatus = i > 0 ? getSkillStatus(skills[i - 1]) : null;

          return (
            <div
              key={`${skill.lessonId}-${skill.icon}`}
              className={`${ZIGZAG[i % 4]} transition-transform duration-500`}
            >
              <div className="node-entrance" style={{ animationDelay: `${i * 60}ms` }}>
                {i > 0 && (
                  <div className="flex justify-center py-1">
                    <div
                      className={`w-1 h-10 rounded-full ${
                        prevStatus === 'completed' ? 'connector-active' : 'connector-inactive'
                      }`}
                    />
                  </div>
                )}
                <SkillNode skill={skill} status={status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

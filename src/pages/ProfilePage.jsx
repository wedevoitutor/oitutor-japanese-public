import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../context/ProgressContext';
import { useSession } from '../hooks/useSession';
import { SKILL_PATHS } from '../data/skillTreePaths';
import SkillTree from '../components/gamification/SkillTree';
import AchievementsSection from '../components/gamification/AchievementsSection';
import BadgesSection from '../components/gamification/BadgesSection';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const session = useSession();
  const { progress, levelProgress, reset } = useProgress();
  const completedCount = Object.values(progress.lessons).filter((l) => l.completed).length;

  useEffect(() => {
    if (session === null) navigate('/login');
  }, [session, navigate]);

  if (!session) {
    return (
      <main className="min-h-screen bg-[#f6f1e6] flex items-center justify-center">
        <p className="text-[#6d28d9] animate-pulse font-mono text-xs uppercase tracking-[0.22em]">{t('portal.loading')}</p>
      </main>
    );
  }

  const stats = [
    { val: progress.xp, label: t('profile.totalXP'), color: 'text-[#6d28d9]' },
    { val: progress.streak.count, label: t('profile.streak'), color: 'text-[#c03a2b]' },
    { val: completedCount, label: t('profile.completed'), color: 'text-[#3a6b3a]' },
  ];

  return (
    <main className="min-h-screen bg-[#f6f1e6] text-[#1a1613] relative overflow-hidden">
      {/* Watermarks */}
      <span className="absolute top-20 -left-6 text-[14rem] font-black text-[#6d28d9]/[.05] select-none pointer-events-none rotate-12 font-serif" aria-hidden>
        我
      </span>
      <span className="absolute bottom-20 -right-8 text-[12rem] font-black text-[#6d28d9]/[.05] select-none pointer-events-none -rotate-6 font-serif" aria-hidden>
        道
      </span>

      {/* Hero */}
      <div className="relative z-10 pt-20 md:pt-28 pb-6 md:pb-10 px-4 md:px-6 text-center">
        <div className="h-1 w-full max-w-3xl mx-auto mb-6 bg-[#1a1613]" />
        <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-[#6d28d9] font-mono">Learner Record</p>
        <h1 className="text-3xl md:text-5xl font-semibold text-[#1a1613] tracking-normal font-serif">
          {t('profile.title')}
        </h1>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pb-16 md:pb-24 space-y-5 md:space-y-6">
        {/* Level card */}
        <div
          className="card-entrance bg-[#fbf7ec]/90 backdrop-blur-sm border border-[#1a1613] shadow-md p-5 md:p-6 relative overflow-hidden"
        >
          <span className="absolute -right-2 -bottom-4 text-6xl md:text-7xl font-black text-[#6d28d9]/[.06] select-none font-serif" aria-hidden>級</span>
          <div className="flex items-center justify-between mb-3 relative">
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-[#6d28d9] font-mono">Lv.{levelProgress.currentLevel}</p>
              <p className="text-[10px] md:text-xs text-[#8a7f72] font-mono mt-1 uppercase tracking-widest">{t('profile.level')}</p>
            </div>
            <p className="text-sm text-[#4a4038] font-mono">
              {levelProgress.xpIntoCurrentLevel} / {levelProgress.xpNeededForNextLevel} XP
            </p>
          </div>
          <ProgressBar current={levelProgress.xpIntoCurrentLevel} total={levelProgress.xpNeededForNextLevel} />
        </div>

        {/* Wooden plaque stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 card-entrance" style={{ animationDelay: '80ms' }}>
          {stats.map(({ val, label, color }) => (
            <div
              key={label}
              className="bg-[#fbf7ec] py-3 md:py-4 px-2 text-center border border-[#d9cfbb] shadow-sm"
            >
              <p className={`text-2xl md:text-3xl font-bold font-mono ${color}`}>{val}</p>
              <p className="text-[#8a7f72] text-[10px] md:text-xs font-mono uppercase tracking-[0.1em] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="card-entrance" style={{ animationDelay: '160ms' }}>
          <AchievementsSection />
        </div>

        {/* Badges */}
        <div className="card-entrance" style={{ animationDelay: '240ms' }}>
          <BadgesSection />
        </div>

        {/* Skill tree */}
        <div className="card-entrance" style={{ animationDelay: '320ms' }}>
          <SkillTree paths={SKILL_PATHS} />
        </div>

        {/* Reset */}
        <div className="pt-4 text-center">
          <Button variant="secondary" onClick={() => { if (confirm('Reset all progress?')) reset(); }}>
            {t('profile.resetProgress')}
          </Button>
        </div>
      </div>
    </main>
  );
}

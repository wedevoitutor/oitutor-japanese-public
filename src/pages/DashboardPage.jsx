import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDashboard } from '../hooks/useDashboard';
import { signOut } from '../lib/dashboardService';
import { useProgress } from '../context/ProgressContext';
import { useAllLessonIds, usePlannedLessonCount } from '../hooks/useLesson';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import SenseiGreeting from '../components/dashboard/SenseiGreeting';
import StatsBar from '../components/dashboard/StatsBar';
import ToriiProgress from '../components/dashboard/ToriiProgress';
import DashboardLessonCard from '../components/dashboard/DashboardLessonCard';
import CherryBlossoms from '../components/dashboard/CherryBlossoms';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { student, lessons, loading, error, session, toggleLesson } = useDashboard();
  const { progress: gamification } = useProgress();
  const allLessonIds = useAllLessonIds();
  const plannedLessonCount = usePlannedLessonCount();
  const [filter, setFilter] = useState('all');
  const [xpPop, setXpPop] = useState(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const curriculumCompleted = allLessonIds.filter((id) => gamification.lessons[id]?.completed).length;
  const curriculumTotal = plannedLessonCount;
  const curriculumPct = curriculumTotal ? Math.round((curriculumCompleted / curriculumTotal) * 100) : 0;

  useEffect(() => {
    if (!loading && session === null) navigate('/login');
  }, [loading, session, navigate]);

  const handleSignOut = async () => { await signOut(); navigate('/login'); };

  const handleToggle = async (id, completed) => {
    await toggleLesson(id, completed);
    if (!completed) {
      setXpPop(id);
      setTimeout(() => setXpPop(null), 1000);
    }
  };

  const filtered = lessons.filter(l =>
    filter === 'pending'   ? !l.completed :
    filter === 'completed' ?  l.completed : true
  );

  if (loading || session === undefined) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f1e6]">
      <p className="text-[#6d28d9] animate-pulse font-mono text-xs uppercase tracking-[0.22em]">{t('portal.loading')}</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f1e6]">
      <p className="text-[#c03a2b]">{error}</p>
    </div>
  );

  const filters = [
    { key: 'all', label: t('portal.filterAll') },
    { key: 'pending', label: t('portal.filterTodo') },
    { key: 'completed', label: t('portal.filterDone') },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f1e6] text-[#1a1613] relative overflow-hidden">
      <CherryBlossoms />
      <DashboardSidebar balance={student?.balance} />

      <main className="flex-1 overflow-y-auto z-[1] pb-16 md:pb-0">
        {/* Header */}
        <header className="bg-[#fbf7ec]/90 backdrop-blur-sm border-b border-[#d9cfbb] px-4 md:px-6 py-3 md:py-4 sticky top-0 z-10 shadow-sm shadow-[#1a1613]/5">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#1a1613]" aria-hidden />
          <div className="flex items-center justify-between max-w-5xl gap-3">
            <SenseiGreeting name={student?.name} />
            <div className="flex items-center gap-2 md:gap-3">
              <StatsBar />
              <button
                type="button"
                onClick={() => setConfirmSignOut(true)}
                aria-label={t('portal.signOut')}
                title={t('portal.signOut')}
                className="inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 text-sm md:text-base text-[#3a2566] bg-[#ede5ff] border border-[#d9c8ff] hover:bg-[#6d28d9] hover:text-white hover:border-[#6d28d9] transition-colors shrink-0"
              >
                <span aria-hidden>⏻</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-5xl">
          <ToriiProgress
            completed={curriculumCompleted}
            remaining={curriculumTotal - curriculumCompleted}
            total={curriculumTotal}
            percentage={curriculumPct}
          />

          {/* Lessons */}
          <div id="lessons">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
              <h2 className="font-semibold text-[#1a1613] text-sm md:text-base font-serif tracking-wide">{t('portal.assignedLessons')}</h2>
              <div className="flex gap-1.5 md:gap-2">
                {filters.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-2.5 md:px-3 py-1 border text-[10px] md:text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                      filter === key
                        ? 'bg-[#6d28d9] text-white border-[#6d28d9] shadow-md shadow-[#6d28d9]/20'
                        : 'bg-[#fbf7ec] text-[#3a2566] hover:bg-[#ede5ff] border-[#d9c8ff]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-[#fbf7ec]/90 backdrop-blur-sm shadow-md border border-[#d9cfbb]">
                <img src="/club-peguin-sensei.gif" alt="" className="w-16 h-16 mx-auto mb-3 opacity-60" />
                <h3 className="font-semibold text-[#1a1613] mb-1 font-serif">{t('portal.noLessons')}</h3>
                <p className="text-xs md:text-sm text-[#4a4038]">{t('portal.noLessonsDesc')}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {filtered.map((a, i) => (
                  <DashboardLessonCard key={a.id} assignment={a} onToggle={handleToggle} index={i} showXpPop={xpPop === a.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={confirmSignOut}
        title={t('portal.signOutConfirmTitle')}
        message={t('portal.signOutConfirmMessage')}
        confirmLabel={t('portal.signOut')}
        cancelLabel={t('portal.cancel')}
        onConfirm={handleSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </div>
  );
}

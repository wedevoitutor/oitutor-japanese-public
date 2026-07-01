import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '../hooks/useSession';
import { useProgress } from '../context/ProgressContext';
import { SKILL_PATHS } from '../data/skillTreePaths';
import PathOverviewStrip from '../components/skilltree/PathOverviewStrip';
import AlphabetsPathPage from './AlphabetsPathPage';
import ScrollPathPage from '../components/skilltree/ScrollPathPage';
import { SCROLL_PATH_CONFIGS } from '../components/skilltree/scrollPathConfigs';
import { isVisiblePathComplete } from '../components/skilltree/skillTreeProgress';

export default function SkillTreePage() {
  const { t } = useTranslation();
  const session = useSession();
  const { progress } = useProgress();
  const [activeId, setActiveId] = useState('alphabets');

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-slate-400 text-sm">{t('skilltree.loading')}</span>
      </div>
    );
  }

  if (session === null) return <Navigate to="/login" replace />;

  const isPathComplete = (pathId) => {
    const path = SKILL_PATHS.find((p) => p.id === pathId);
    return isVisiblePathComplete(path, progress.lessons);
  };

  const getPathLocked = (path) =>
    path.prereqs?.some((id) => !isPathComplete(id)) ?? false;

  const activePath = SKILL_PATHS.find((p) => p.id === activeId);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-950 via-red-900 to-red-700 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <span className="text-[clamp(8rem,20vw,18rem)] text-white/[.04] font-bold select-none leading-none tracking-wider">
            学習
          </span>
        </div>
        <div className="relative z-10 text-center py-14 px-6">
          <h1 className="font-extrabold text-white text-[clamp(2rem,5vw,3rem)] leading-tight mb-1">
            {t('skilltree.title')}
          </h1>
          <p className="text-white/70 text-sm">{t('skilltree.subtitle')}</p>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 py-10 sm:px-6">
        <PathOverviewStrip activeId={activeId} onSelect={setActiveId} className="mb-8 w-full" />

        {/* Path tabs */}
        <div className="flex w-full flex-wrap gap-2 mb-8 justify-center">
          {SKILL_PATHS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeId === p.id
                  ? 'bg-red-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.titleJp} <span className="hidden sm:inline font-normal ml-1">{p.label}</span>
            </button>
          ))}
        </div>

        {activePath?.id === 'alphabets' && <AlphabetsPathPage />}

        {activePath?.id !== 'alphabets' && SCROLL_PATH_CONFIGS[activePath?.id] && (
          <ScrollPathPage key={activePath.id} pathConfig={SCROLL_PATH_CONFIGS[activePath.id]} isPathLocked={getPathLocked(activePath)} />
        )}
      </section>
    </>
  );
}

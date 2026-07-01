import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SkillNode({ skill, status }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (status === 'completed' || status === 'available')
      navigate(`/curriculum/${skill.sectionSlug}/${skill.lessonSlug}`);
  };

  if (status === 'completed') {
    return (
      <div onClick={handleClick} className="flex flex-col items-center cursor-pointer group">
        <div className="node-completed w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center text-3xl border-2 border-green-300/50 relative transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5">
          <span>{skill.icon}</span>
          <div className="check-pop absolute -top-1 -right-1 w-6 h-6 bg-white rounded-xl flex items-center justify-center text-green-500 text-sm shadow-md font-bold">
            ✓
          </div>
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-600 group-hover:text-green-500 text-center max-w-[140px] transition-colors duration-200">
          {skill.title}
        </p>
      </div>
    );
  }

  if (status === 'available') {
    return (
      <div onClick={handleClick} className="flex flex-col items-center cursor-pointer group">
        <div className="node-float">
          <div className="node-current w-20 h-20 bg-gradient-to-br from-white to-red-50 rounded-3xl flex items-center justify-center text-4xl border-2 border-red-500 transition-transform duration-200 group-hover:scale-110">
            <span>{skill.icon}</span>
          </div>
        </div>
        <p className="mt-2 text-sm font-bold text-red-500 text-center max-w-[140px]">
          {skill.title}
        </p>
        <div className="mt-2 px-5 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-shadow duration-200 flex items-center gap-1">
          {t('skilltree.continue')} <span className="arrow-icon inline-block">→</span>
        </div>
      </div>
    );
  }

  return (
    <div className="node-locked flex flex-col items-center opacity-50 hover:opacity-75 transition-opacity duration-200">
      <div className="w-14 h-14 bg-slate-200/80 rounded-3xl flex items-center justify-center text-2xl border-2 border-slate-300/50 grayscale hover:grayscale-[.3] transition-all duration-200 hover:scale-105">
        <span className="lock-icon inline-block">🔒</span>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-400 text-center max-w-[120px]">
        {skill.title}
      </p>
    </div>
  );
}

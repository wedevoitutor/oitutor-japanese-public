/**
 * Team page — /team
 * Displays two co-founders with bio, highlights, and social links.
 */
import { useTranslation } from 'react-i18next';

const MEMBERS = [
  {
    key: 'productLead',
    initials: 'PL',
    highlights: ['fullstack', 'aiEducation', 'multilingual', 'curriculum', 'vps'],
  },
  {
    key: 'engineeringLead',
    initials: 'EL',
    highlights: ['fullstack', 'python', 'webTech'],
  },
];

export default function TeamPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6 relative overflow-hidden">
      {/* Kanji watermarks */}
      <span className="absolute top-20 left-10 text-[14rem] font-black text-white/[.02] select-none pointer-events-none" aria-hidden="true">仲</span>
      <span className="absolute bottom-20 right-10 text-[14rem] font-black text-white/[.02] select-none pointer-events-none rotate-12" aria-hidden="true">間</span>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t('team.title')}
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {MEMBERS.map(({ key, initials, highlights }, i) => (
            <div key={key} className="card-entrance bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:-translate-y-1 transition-all text-center" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/10 bg-red-600/20 text-red-100 flex items-center justify-center text-3xl font-bold">
                {initials}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                {t(`team.${key}.name`)}
              </h2>
              <p className="text-red-400 font-semibold text-sm mb-4">
                {t(`team.${key}.role`)}
              </p>
              <p className="text-white/50 leading-relaxed mb-6">
                {t(`team.${key}.bio`)}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {highlights.map((h) => (
                  <span key={h} className="text-xs font-semibold bg-white/10 text-white/70 px-3 py-1 rounded-full">
                    {t(`team.highlights.${h}`)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Terms of Service page — /terms-of-service
 * Legal-style placeholder text with standard sections.
 */
import { useTranslation } from 'react-i18next';

const SECTIONS = [
  'introduction',
  'acceptance',
  'eligibility',
  'intellectualProperty',
  'userConduct',
  'termination',
  'disclaimers',
  'governingLaw',
  'changes',
  'contactInfo',
];

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Watermarks */}
      <span className="absolute top-20 -left-8 text-[14rem] font-black text-white/[.02] select-none pointer-events-none rotate-12" aria-hidden>
        約
      </span>
      <span className="absolute bottom-16 -right-6 text-[12rem] font-black text-white/[.02] select-none pointer-events-none -rotate-6" aria-hidden>
        法
      </span>

      {/* Hero */}
      <div className="relative z-10 pt-20 md:pt-28 pb-8 md:pb-12 px-4 md:px-6 text-center">
        <div className="h-0.5 w-24 mx-auto mb-8 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {t('terms.title')}
        </h1>
        <p className="text-xs md:text-sm text-white/30">
          {t('terms.lastUpdated')}: 2026-01-01
        </p>
      </div>

      {/* Sections */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pb-16 md:pb-24 space-y-4 md:space-y-6">
        {SECTIONS.map((key, i) => (
          <section
            key={key}
            className="card-entrance p-5 md:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <h2 className="text-lg md:text-xl font-bold text-white mb-3">
              {i + 1}. {t(`terms.${key}.title`)}
            </h2>
            <p className="text-sm md:text-base text-white/50 leading-relaxed">
              {t(`terms.${key}.body`)}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}

import { useTranslation } from 'react-i18next';

export default function CourseHero() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-red-950 via-red-900 to-red-700 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span className="text-[clamp(8rem,20vw,18rem)] text-white/[.04] font-bold select-none leading-none tracking-wider">
          日本語
        </span>
      </div>
      <div className="relative z-10 text-center py-16 px-6">
        <span className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm font-bold text-white mb-4">
          🇯🇵 JAPANESE
        </span>
        <h1 className="font-extrabold text-white text-[clamp(2.2rem,6vw,3.6rem)] leading-tight mb-1">
          {t('course.title')}
        </h1>
        <p className="text-white/75 text-[clamp(1rem,2.5vw,1.4rem)] tracking-wider mb-6">
          {t('course.subtitle')}
        </p>
        <p className="max-w-xl mx-auto text-white/70 text-sm leading-relaxed">
          {t('course.heroDesc')}
        </p>
      </div>
    </section>
  );
}

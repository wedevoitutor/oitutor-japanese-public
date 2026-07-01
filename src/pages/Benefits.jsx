import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const BENEFITS = [
  { icon: '❤️', titleKey: 'benefits.hearts.title', descKey: 'benefits.hearts.desc' },
  { icon: '🚫', titleKey: 'benefits.noAds.title', descKey: 'benefits.noAds.desc' },
  { icon: '📱', titleKey: 'benefits.offline.title', descKey: 'benefits.offline.desc' },
  { icon: '🏆', titleKey: 'benefits.xp.title', descKey: 'benefits.xp.desc' },
];

export default function Benefits() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Watermarks */}
      <span className="absolute top-16 -right-6 text-[14rem] font-black text-white/[.02] select-none pointer-events-none -rotate-12" aria-hidden>
        益
      </span>
      <span className="absolute bottom-20 -left-8 text-[10rem] font-black text-white/[.02] select-none pointer-events-none rotate-6" aria-hidden>
        力
      </span>

      {/* Hero */}
      <div className="relative z-10 pt-20 md:pt-28 pb-12 md:pb-16 px-4 md:px-6 text-center">
        <div className="h-0.5 w-24 mx-auto mb-8 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 tracking-tight">
          {t('benefits.heroTitle')}
        </h1>
        <p className="text-base md:text-xl text-white/50 max-w-2xl mx-auto">
          {t('benefits.heroSubtitle')}
        </p>
      </div>

      {/* Benefit cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pb-8 md:pb-12">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {BENEFITS.map((benefit, i) => (
            <div
              key={benefit.titleKey}
              className="card-entrance flex gap-4 md:gap-6 p-5 md:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-3xl md:text-5xl shrink-0">{benefit.icon}</div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2">{t(benefit.titleKey)}</h3>
                <p className="text-xs md:text-base text-white/40 leading-relaxed">{t(benefit.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 text-center pb-20 md:pb-28 px-4">
        <Link
          to="/subscription"
          className="inline-block bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-xl shadow-lg shadow-red-500/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/30"
        >
          {t('benefits.ctaButton')}
        </Link>
      </div>
    </main>
  );
}

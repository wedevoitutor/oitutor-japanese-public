import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Newsletter from '../components/Newsletter';
import HeroSection from '../components/landing/HeroSection';

const METHOD_CARDS = [
  { icon: '🎵', titleKey: 'method1Title', descKey: 'method1Desc', to: '/curriculum' },
  { icon: '🗣️', titleKey: 'method2Title', descKey: 'method2Desc', to: '/curriculum' },
  { icon: '⛩️', titleKey: 'method3Title', descKey: 'method3Desc', to: '/benefits' },
];

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
      <HeroSection />

      {/* Methodology */}
      <section id="methodology" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('landing.methodTitle')}</h2>
          <p className="text-slate-600 mb-16 max-w-2xl mx-auto">{t('landing.methodDesc')}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {METHOD_CARDS.map((card, i) => (
              <div
                key={card.titleKey}
                className="card-entrance group p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-red-200/50 text-left transition-all duration-200 hover:scale-105"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t(`landing.${card.titleKey}`)}</h3>
                <p className="text-slate-600 mb-5">{t(`landing.${card.descKey}`)}</p>
                <Link
                  to={card.to}
                  className="inline-flex items-center gap-1 text-sm font-medium text-red-600 group-hover:text-red-500 transition-colors"
                >
                  {t('landing.startJourney')}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      {/* CTA Footer */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <span className="absolute -left-8 top-8 text-[12rem] font-black text-white/[.02] select-none pointer-events-none" aria-hidden>始</span>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-2" />
          <h2 className="text-3xl md:text-4xl font-bold">{t('landing.ctaTitle')}</h2>
          <p className="text-slate-400 text-lg">{t('landing.ctaDesc')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a href="/contact" className="bg-[#25D366] hover:bg-[#20b858] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#25D366]/30">
              {t('landing.whatsapp')}
            </a>
            <a href="mailto:support@example.com" className="border-2 border-slate-600 hover:border-white/50 px-8 py-4 rounded-full font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-lg hover:shadow-white/5">
              {t('landing.email')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

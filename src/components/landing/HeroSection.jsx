import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Typewriter from '../ui/Typewriter';
import pagodaImg from '../../assets/pagoda.jpg';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${pagodaImg})` }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/25" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
          {t('landing.heroTitle')}{' '}
          <Typewriter
            words={t('landing.heroHighlight', { returnObjects: true })}
            className="text-red-550"
          />{' '}
          <span className="bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,200,0.8)]">
            {t('landing.heroHighlightSuffix')}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
          {t('landing.heroDesc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/curriculum"
            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-red-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/30"
          >
            {t('landing.startJourney')}
          </Link>
          <a
            href="#methodology"
            className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-full text-lg font-bold backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
          >
            {t('landing.learnMore')}
          </a>
        </div>
      </div>
    </section>
  );
}

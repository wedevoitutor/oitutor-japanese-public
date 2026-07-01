import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaYoutube, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { getFooterNav, getLegalNav } from '../../config/navigation';
import logoSensei from '../../assets/logo-sensei.png';

const SOCIAL_LINKS = [
  { icon: FaInstagram, href: 'https://example.com/instagram', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://example.com/youtube', label: 'YouTube' },
  { icon: FaWhatsapp, href: 'https://example.com/contact', label: 'Contact' },
  { icon: FaLinkedin, href: 'https://example.com/linkedin', label: 'LinkedIn' },
];

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Red accent line — mirrors the navbar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      {/* Decorative watermark */}
      <span className="absolute -right-8 bottom-4 text-[14rem] font-black text-white/[.02] select-none pointer-events-none" aria-hidden>
        道
      </span>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">

          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left">
            <Link to="/" className="inline-block mb-3 group">
              <img src={logoSensei} alt="OiTutor" className="h-10 w-auto brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              <span className="text-xs font-bold tracking-widest text-white/20">日本語</span>
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2.5">
              {getFooterNav().map(item => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-white/60 hover:text-red-400 transition-colors">
                    {t(item.i18nKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2.5">
              {getLegalNav().map(item => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-white/60 hover:text-red-400 transition-colors">
                    {t(item.i18nKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">{t('footer.social')}</h4>
            <div className="flex justify-center md:justify-start gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 border border-white/10 rounded-full text-white/40 hover:text-red-400 hover:border-red-400/30 hover:bg-white/5 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2 text-center">
          <p className="text-xs text-white/30">
            &copy; {currentYear} OiTutor. {t('landing.copyright')}
          </p>
          <p className="text-xs text-white/30">Made with <span className="text-red-500">&hearts;</span> for Japanese learners.</p>
        </div>
      </div>
    </footer>
  );
}

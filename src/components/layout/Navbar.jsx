import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import { getMainNav, getCompanyNav, getAccountNav } from '../../config/navigation';
import { useSession } from '../../hooks/useSession';
import { supabase } from '../../lib/supabase';
import NavLink from '../ui/NavLink';
import JapaneseActionButton from '../ui/JapaneseActionButton';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import XPDisplay from '../gamification/XPDisplay';
import StreakDisplay from '../gamification/StreakDisplay';
import logoSensei from '../../assets/logo-sensei.png';

const GAMIFICATION_PATHS = ['/curriculum', '/profile', '/dashboard', '/shop', '/skilltree'];

/**
 * Navbar component
 * Handles navigation, gamification stats display, and authentication actions.
 */
export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const session = useSession();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/';
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error.message);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const mainItems = getMainNav();
  const moreItems = [...getCompanyNav(), ...(session ? getAccountNav() : [])];
  const isMoreActive = moreItems.some(i => pathname === i.path);
  const isHome = pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-slate-900/5'
            : isHome
              ? 'bg-transparent'
              : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        <div className={`max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoSensei} alt="OiTutor" className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-8 md:h-9' : 'h-10 md:h-11'}`} />
            <span className={`hidden md:block text-xs font-bold tracking-widest transition-colors ${
              scrolled || !isHome ? 'text-slate-400' : 'text-white/50'
            }`}>
              日本語
            </span>
          </Link>

          {/* Desktop Nav - Center */}
          <nav className="hidden md:flex items-center gap-1" role="navigation">
            {mainItems.map(item => (
              <NavLink
                key={item.path}
                {...item}
                className={`px-3 py-2 text-sm ${
                  !scrolled && isHome ? 'text-white/90 hover:text-white hover:bg-white/10' : 'hover:bg-red-50/80'
                }`}
              />
            ))}

            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(prev => !prev)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isMoreActive
                    ? 'text-red-600'
                    : !scrolled && isHome
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-red-600 hover:bg-red-50/80'
                }`}
              >
                {t('nav.more')}
                <FaChevronDown size={10} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl py-2 z-50 nav-overlay-enter">
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-3 mb-2" />
                  {moreItems.map((item, i) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className="block px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {t(item.i18nKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side - Ações e Gamificação */}
          <div className="flex items-center gap-2 md:gap-3">
            {session === null && (
              <div className="hidden md:flex items-center gap-3 mr-2">
                <JapaneseActionButton
                  to="/login"
                  variant="washi"
                  size="sm"
                  className={!scrolled && isHome ? 'border-white/30 bg-white/10 text-white hover:bg-white/15' : ''}
                >
                  {t('nav.login')}
                </JapaneseActionButton>
                <JapaneseActionButton
                  to="/signup"
                  variant="vermilion"
                  size="sm"
                >
                  {t('nav.signup')}
                </JapaneseActionButton>
              </div>
            )}

            {session && GAMIFICATION_PATHS.includes(pathname) && (
              <>
                <StreakDisplay />
                <XPDisplay />
              </>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* BOTÃO SAIR PREMIUM - Tradução Dinâmica Aplicada */}
            {session && (
              <div className="relative group">
                <button
                  onClick={handleLogout}
                  className={`
                    relative flex items-center justify-center p-2 rounded-lg transition-all duration-300
                    hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/50
                    ${
                      !scrolled && isHome 
                        ? 'text-white/90 hover:text-white hover:bg-white/10' 
                        : 'text-slate-600 hover:text-red-600 hover:bg-red-50 shadow-sm hover:shadow'
                    }
                  `}
                >
                  <span className="absolute inset-0 rounded-lg bg-red-500/10 animate-ping group-hover:block hidden" />
                  <FaSignOutAlt size={18} className="relative z-10" />
                </button>

                {/* Tooltip com Tradução Dinâmica */}
                <div className="
                  absolute top-full right-0 mt-2 px-3 py-1.5 
                  bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider 
                  rounded-md shadow-xl opacity-0 group-hover:opacity-100 
                  pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0
                  whitespace-nowrap z-[70]
                ">
                  {t('auth.logout')}
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
              </div>
            )}

            {/* Hamburger Mobile */}
            <button
              className={`md:hidden p-2 ${!scrolled && isHome ? 'text-white' : 'text-slate-700'}`}
              onClick={() => setMenuOpen(prev => !prev)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      {!isHome && <div className="h-[52px] md:h-[56px]" />}
      
      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] nav-overlay-enter">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={closeMenu} />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-4">
              <Link to="/" onClick={closeMenu}>
                <img src={logoSensei} alt="OiTutor" className="h-9" />
              </Link>
              <button onClick={closeMenu} className="p-2 text-white/70">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 flex flex-col items-center justify-center gap-1 px-8">
              {[...getMainNav(), ...getCompanyNav(), ...(session ? getAccountNav() : [])].map((item, i) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`w-full text-center py-3 text-lg font-medium rounded-xl ${
                    pathname === item.path ? 'text-red-400 bg-white/5' : 'text-white/80'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {t(item.i18nKey)}
                </Link>
              ))}
            </nav>

            <div className="px-8 pb-8 space-y-4">
              {session ? (
                <button 
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="w-full py-3 bg-white/5 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaSignOutAlt />
                  {t('auth.logout')}
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={closeMenu} className="block w-full rounded-full border border-white/20 bg-white/10 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-white/90">
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" onClick={closeMenu} className="block w-full rounded-full border border-[#9f2f24] bg-[#c03a2b] py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm shadow-[#c03a2b]/25">
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
              <div className="flex justify-center"><LanguageSwitcher /></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

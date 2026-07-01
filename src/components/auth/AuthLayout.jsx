import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import AuthBrandPanel from './AuthBrandPanel';
import logoSensei from '../../assets/logo-sensei.png';

const backgroundImage = 'url("/dark_background_nihongo_oitutor.png")';

/**
 * Shared standalone auth layout for /login and /signup.
 *
 * @param {{ children: import('react').ReactNode, title: string, subtitle: string, variant?: 'login' | 'signup' }} props
 */
export default function AuthLayout({ children, title, subtitle, variant = 'login' }) {
  const { t } = useTranslation();
  const isSignup = variant === 'signup';

  return (
    <main
      className="auth-page relative min-h-[100svh] overflow-x-hidden bg-[#030814] bg-cover bg-center bg-no-repeat text-slate-50 max-[639px]:bg-[position:58%_center]"
      style={{ backgroundImage }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,rgba(2,6,15,0.12)_68%,rgba(1,4,11,0.42)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,15,0.08)_0%,rgba(2,6,15,0)_42%,rgba(2,6,15,0.16)_100%)]" />

      <Link
        to="/"
        className="absolute left-6 top-6 z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-[#061225]/55 px-4 py-2 text-sm font-semibold text-slate-200/82 shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/25 min-[900px]:flex"
      >
        <FaArrowLeft size={13} aria-hidden="true" />
        {t('common.backToHome')}
      </Link>

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-3 py-5 sm:px-6 sm:py-8 min-[900px]:px-8 min-[900px]:py-10">
        <section
          className={[
            'w-full max-w-[430px] overflow-hidden rounded-[24px] border border-white/12 bg-[rgba(8,18,38,0.64)] shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl',
            'motion-safe:animate-[auth-card-in_220ms_ease-out_both]',
            'min-[640px]:max-w-[520px] min-[640px]:rounded-[28px]',
            'min-[900px]:grid min-[900px]:max-w-[1010px] min-[900px]:grid-cols-[0.85fr_1.15fr] min-[900px]:rounded-[32px]',
            isSignup ? 'min-[900px]:min-h-[640px]' : 'min-[900px]:min-h-[540px]',
          ].join(' ')}
        >
          <AuthBrandPanel variant={variant} />

          <div className="flex min-w-0 items-center justify-center px-5 py-6 sm:px-8 sm:py-8 min-[900px]:px-12 min-[900px]:py-10">
            <div className="w-full max-w-[390px]">
              <div className="mb-6 text-center min-[900px]:text-left">
                <Link
                  to="/"
                  className="mb-5 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold text-slate-300/82 transition-colors hover:text-white focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/25 min-[900px]:hidden"
                >
                  <FaArrowLeft size={13} aria-hidden="true" />
                  {t('common.backToHome')}
                </Link>

                <div className="mb-5 flex items-center justify-center min-[900px]:hidden">
                  <img
                    src={logoSensei}
                    alt={t('common.logoAlt')}
                    className="h-24 w-24 rounded-[28px] object-contain shadow-xl shadow-black/30"
                  />
                </div>

                <h1 className="text-2xl font-extrabold tracking-normal text-[#f8fbff] sm:text-[28px] min-[900px]:text-[30px]">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-300/72">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

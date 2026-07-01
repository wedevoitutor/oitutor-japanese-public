import { useTranslation } from 'react-i18next';
import logoSensei from '../../assets/logo-sensei.png';

/**
 * Shared desktop brand panel for standalone auth pages.
 *
 * @param {{ variant?: 'login' | 'signup' }} props
 */
export default function AuthBrandPanel({ variant = 'login' }) {
  const { t } = useTranslation();
  const itemKeys = variant === 'signup'
    ? ['signup.benefit1', 'signup.benefit2', 'signup.benefit3']
    : ['portal.feature1', 'portal.feature2', 'portal.feature3'];

  return (
    <aside className="relative hidden min-w-0 flex-col justify-between overflow-hidden border-r border-white/10 bg-[linear-gradient(160deg,rgba(12,27,58,0.58),rgba(4,10,24,0.28))] px-10 py-10 text-white min-[900px]:flex">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(147,197,253,0.14),transparent_32%),radial-gradient(circle_at_80%_86%,rgba(239,74,58,0.1),transparent_34%)]" />
      <div className="relative">
        <img
          src={logoSensei}
          alt={t('common.logoAlt')}
          className="h-14 w-14 rounded-2xl object-contain shadow-xl shadow-black/30"
        />
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#ff8b82]">OiTutor</p>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-normal text-[#f8fbff]">
          Learn Japanese.
          <br />
          Master the path.
        </h2>
        <p className="mt-4 max-w-[260px] text-sm leading-6 text-slate-300/76">
          {variant === 'signup' ? t('signup.panelDesc') : t('portal.welcomeDesc')}
        </p>
      </div>

      <ul className="relative space-y-3">
        {itemKeys.map((key) => (
          <li key={key} className="flex items-center gap-3 text-sm font-medium text-slate-200/78">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b5f] shadow-[0_0_16px_rgba(255,107,95,0.75)]" aria-hidden="true" />
            {t(key)}
          </li>
        ))}
      </ul>
    </aside>
  );
}

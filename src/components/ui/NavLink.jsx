import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Reusable nav link with active state.
 * @param {{ path: string, i18nKey: string, onClick?: function, className?: string }} props
 */
export default function NavLink({ path, i18nKey, onClick, className = '' }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const active = pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`relative font-medium rounded-lg transition-all duration-200 ${
        active ? 'text-red-600' : 'text-slate-600 hover:text-red-600'
      } ${className}`}
    >
      {t(i18nKey)}
    </Link>
  );
}

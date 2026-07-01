import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';

/**
 * Mandatory legal acceptance checkbox for account creation.
 *
 * @param {{ checked: boolean, onChange: (checked: boolean) => void, disabled?: boolean }} props
 */
export default function TermsAcceptanceCheckbox({ checked, onChange, disabled = false }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-white/14 bg-white/[0.05] px-3 py-3 text-left">
      <label htmlFor="signup-legal-acceptance" className="flex items-start gap-3 text-xs leading-5 text-slate-200/78">
        <input
          id="signup-legal-acceptance"
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-required="true"
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-white/25 bg-[#030a18]/70 text-[#93c5fd] focus:ring-4 focus:ring-[#93c5fd]/20 disabled:opacity-55"
        />
        <span>
          {t('signup.termsAcceptPrefix')}{' '}
          <Link
            to={ROUTES.TERMS}
            className="font-bold text-[#ff6b5f] underline-offset-4 transition-colors hover:text-[#ff8b82] hover:underline focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/20"
          >
            {t('signup.termsAcceptTerms')}
          </Link>{' '}
          {t('signup.termsAcceptAnd')}{' '}
          <Link
            to={ROUTES.PRIVACY}
            className="font-bold text-[#ff6b5f] underline-offset-4 transition-colors hover:text-[#ff8b82] hover:underline focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/20"
          >
            {t('signup.termsAcceptPrivacy')}
          </Link>
        </span>
      </label>
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Standard text input used by standalone auth forms.
 *
 * @param {{ id: string, labelKey: string, value: string, onChange: (value: string) => void, type?: string, placeholderKey: string, autoComplete: string }} props
 */
export default function AuthTextField({
  id,
  labelKey,
  value,
  onChange,
  type = 'text',
  placeholderKey,
  autoComplete,
}) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="text-left">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-50/92">
        {t(labelKey)}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t(placeholderKey)}
          required
          autoComplete={autoComplete}
          className={`h-12 w-full rounded-xl border border-[#b4cdf0]/24 bg-[#030a18]/48 px-4 text-[15px] text-[#f8fbff] caret-[#93c5fd] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-all placeholder:text-slate-300/50 focus:border-[#93c5fd] focus:bg-[#050e1e]/70 focus:ring-4 focus:ring-[#93c5fd]/20 ${isPassword ? 'pr-12' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-300/78 transition-colors hover:bg-[#93c5fd]/12 hover:text-[#bfdbfe] focus:outline-none focus:ring-4 focus:ring-[#93c5fd]/18"
          >
            {showPassword ? <FaEyeSlash size={15} aria-hidden="true" /> : <FaEye size={15} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}

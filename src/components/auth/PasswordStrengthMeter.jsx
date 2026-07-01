import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';

function getPasswordRequirements(password) {
  return [
    {
      key: 'signup.passwordRuleLowercase',
      met: /[a-z]/.test(password),
    },
    {
      key: 'signup.passwordRuleUppercase',
      met: /[A-Z]/.test(password),
    },
    {
      key: 'signup.passwordRuleDigits',
      met: /\d/.test(password),
    },
    {
      key: 'signup.passwordRuleSymbols',
      met: /[^A-Za-z0-9]/.test(password),
    },
    {
      key: 'signup.passwordRuleLength',
      met: password.length >= 10,
    },
  ];
}

/**
 * Live password policy checklist for signup.
 *
 * @param {{ password: string }} props
 */
export default function PasswordStrengthMeter({ password }) {
  const { t } = useTranslation();
  const requirements = getPasswordRequirements(password);

  return (
    <ul className="-mt-1 space-y-2 rounded-xl border border-[#93c5fd]/18 bg-[#061225]/46 px-3 py-3 text-left text-xs leading-5 text-slate-200/78">
      {requirements.map((requirement) => (
        <li key={requirement.key} className="flex items-start gap-2">
          <span
            className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
              requirement.met
                ? 'border-[#93c5fd] bg-[#93c5fd] text-[#061225]'
                : 'border-slate-400/35 text-transparent'
            }`}
            aria-hidden="true"
          >
            <FaCheck size={9} />
          </span>
          <span className={requirement.met ? 'font-medium text-[#dbeafe]' : ''}>
            {t(requirement.key)}
          </span>
        </li>
      ))}
    </ul>
  );
}

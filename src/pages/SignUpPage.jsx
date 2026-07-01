import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthCaptcha from '../components/auth/AuthCaptcha';
import AuthDivider from '../components/auth/AuthDivider';
import AuthLayout from '../components/auth/AuthLayout';
import AuthPrimaryButton from '../components/auth/AuthPrimaryButton';
import AuthSocialButton from '../components/auth/AuthSocialButton';
import AuthTextField from '../components/auth/AuthTextField';
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter';
import TermsAcceptanceCheckbox from '../components/auth/TermsAcceptanceCheckbox';
import { signInWithProvider, signOut, signUpStudent } from '../lib/authService';

const MIN_PASSWORD_LENGTH = 10;
const SUBMIT_COOLDOWN_MS = 5000;
const PASSWORD_POLICY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

function getSignUpErrorKey(error) {
  const message = error?.message?.toLowerCase() ?? '';
  const status = error?.status;

  if (status === 429 || message.includes('rate limit')) return 'signup.errorRateLimited';
  if (message.includes('password') && (message.includes('at least') || message.includes('weak'))) return 'signup.errorPasswordPolicy';
  if (message.includes('already registered')) return 'signup.errorRegistered';
  if (message.includes('provider') || message.includes('oauth')) return 'auth.errorProviderUnavailable';
  if (message.includes('captcha')) return 'auth.errorCaptcha';
  return 'signup.errorGeneric';
}

export default function SignUpPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [status, setStatus] = useState({ type: '', key: '' });
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0);
  const handleCaptchaToken = useCallback((token) => setCaptchaToken(token), []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', key: '' });

    if (company.trim()) {
      setStatus({ type: 'success', key: 'signup.confirmationSent' });
      return;
    }

    if (Date.now() - lastSubmittedAt < SUBMIT_COOLDOWN_MS) {
      setStatus({ type: 'error', key: 'signup.errorCooldown' });
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH || !PASSWORD_POLICY_REGEX.test(password)) {
      setStatus({ type: 'error', key: 'signup.errorPasswordPolicy' });
      return;
    }

    if (!acceptedTerms) {
      setStatus({ type: 'error', key: 'signup.errorTermsRequired' });
      return;
    }

    if (!captchaToken) {
      setStatus({ type: 'error', key: 'auth.errorCaptchaRequired' });
      return;
    }

    setLoading(true);
    setLastSubmittedAt(Date.now());

    try {
      const { data, error } = await signUpStudent({ name, email, password, captchaToken });
      if (error) throw error;

      setName('');
      setEmail('');
      setPassword('');
      setAcceptedTerms(false);

      if (data?.session) {
        await signOut();
        setStatus({ type: 'success', key: 'signup.accountReady' });
        return;
      }

      setStatus({ type: 'success', key: 'signup.confirmationSent' });
    } catch (error) {
      setStatus({ type: 'error', key: getSignUpErrorKey(error) });
    } finally {
      setLoading(false);
    }
  }

  async function handleDiscordSignUp() {
    setStatus({ type: '', key: '' });
    if (!acceptedTerms) {
      setStatus({ type: 'error', key: 'signup.errorTermsRequired' });
      return;
    }

    setOauthLoading(true);
    const { error } = await signInWithProvider('discord');
    setOauthLoading(false);
    if (error) setStatus({ type: 'error', key: getSignUpErrorKey(error) });
  }

  return (
    <AuthLayout title={t('signup.title')} subtitle={t('signup.subtitle')} variant="signup">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <AuthTextField id="signup-name" labelKey="signup.name" value={name} onChange={setName} placeholderKey="signup.placeholder_name" autoComplete="name" />
        <AuthTextField id="signup-email" labelKey="signup.email" type="email" value={email} onChange={setEmail} placeholderKey="signup.placeholder_email" autoComplete="email" />
        <AuthTextField id="signup-password" labelKey="signup.password" type="password" value={password} onChange={setPassword} placeholderKey="signup.placeholder_password" autoComplete="new-password" />
        <PasswordStrengthMeter password={password} />
        <TermsAcceptanceCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} disabled={loading || oauthLoading} />
        <AuthCaptcha onTokenChange={handleCaptchaToken} />

        {status.key && (
          <p className={`rounded-xl border px-3 py-2 text-left text-sm ${status.type === 'success' ? 'border-emerald-300/25 bg-emerald-950/35 text-emerald-200' : 'border-[#ff6b5f]/25 bg-[#3d1115]/55 text-[#ff9a91]'}`}>
            {t(status.key)}
          </p>
        )}

        <AuthPrimaryButton disabled={loading}>
          {loading ? t('signup.loading') : t('signup.button')}
        </AuthPrimaryButton>
      </form>

      <AuthDivider />

      <AuthSocialButton disabled={oauthLoading} onClick={handleDiscordSignUp}>
        {oauthLoading ? t('auth.redirecting') : t('auth.signupWithDiscord')}
      </AuthSocialButton>

      <p className="mt-6 text-center text-sm text-slate-300/72">
        {t('signup.already_have_account')}{' '}
        <Link to="/login" className="font-bold text-[#ff6b5f] underline-offset-4 transition-colors hover:text-[#ff8b82] hover:underline focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/20">
          {t('signup.login_here')}
        </Link>
      </p>
    </AuthLayout>
  );
}

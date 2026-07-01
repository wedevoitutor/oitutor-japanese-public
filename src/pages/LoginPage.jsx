/**
 * Login page - /login
 * Split layout: branding panel (left) + form (right).
 * Outside PageShell (no Navbar/Footer).
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthDivider from '../components/auth/AuthDivider';
import AuthLayout from '../components/auth/AuthLayout';
import AuthPrimaryButton from '../components/auth/AuthPrimaryButton';
import AuthSocialButton from '../components/auth/AuthSocialButton';
import AuthTextField from '../components/auth/AuthTextField';
import { signIn, signInWithProvider } from '../lib/authService';

function getSignInErrorKey(error) {
  const message = error?.message?.toLowerCase() ?? '';
  const status = error?.status;

  if (status === 429 || message.includes('rate limit')) return 'portal.errorRateLimited';
  if (message.includes('email not confirmed')) return 'portal.errorEmailNotConfirmed';
  if (message.includes('invalid login')) return 'portal.errorInvalidCredentials';
  if (message.includes('provider') || message.includes('oauth')) return 'auth.errorProviderUnavailable';
  return 'portal.errorGeneric';
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(t(getSignInErrorKey(err))); return; }
    navigate('/dashboard');
  }

  async function handleDiscordSignIn() {
    setError('');
    setOauthLoading(true);
    const { error: err } = await signInWithProvider('discord');
    setOauthLoading(false);
    if (err) setError(t(getSignInErrorKey(err)));
  }

  return (
    <AuthLayout title={t('portal.login')} subtitle={t('portal.loginSubtitle')} variant="login">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthTextField id="login-email" labelKey="portal.email" type="email" value={email} onChange={setEmail} placeholderKey="portal.emailPlaceholder" autoComplete="email" />
        <AuthTextField id="login-password" labelKey="portal.password" type="password" value={password} onChange={setPassword} placeholderKey="portal.passwordPlaceholder" autoComplete="current-password" />

        {error && (
          <p className="rounded-xl border border-[#ff6b5f]/25 bg-[#3d1115]/55 px-3 py-2 text-left text-sm text-[#ff9a91]">
            {error}
          </p>
        )}

        <AuthPrimaryButton disabled={loading}>
          {loading ? t('portal.signingIn') : t('portal.signIn')}
        </AuthPrimaryButton>
      </form>

      <AuthDivider />

      <AuthSocialButton disabled={oauthLoading} onClick={handleDiscordSignIn}>
        {oauthLoading ? t('auth.redirecting') : t('auth.loginWithDiscord')}
      </AuthSocialButton>

      <p className="mt-5 text-center text-sm text-slate-300/72">
        {t('portal.noAccountPrompt')}{' '}
        <Link to="/signup" className="font-bold text-[#ff6b5f] underline-offset-4 transition-colors hover:text-[#ff8b82] hover:underline focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/20">
          {t('portal.createAccount')}
        </Link>
      </p>

      <p className="mt-4 text-center text-sm leading-6 text-slate-300/72">
        {t('portal.contactPrompt')}{' '}
        <a href={`mailto:${t('portal.contactEmail')}`} className="font-semibold text-[#ff6b5f] underline-offset-4 transition-colors hover:text-[#ff8b82] hover:underline focus:outline-none focus:ring-4 focus:ring-[#ef4a3a]/20">
          {t('portal.contactEmail')}
        </a>
      </p>
    </AuthLayout>
  );
}

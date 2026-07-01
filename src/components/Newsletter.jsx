import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthCaptcha from './auth/AuthCaptcha';

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [status, setStatus] = useState('idle');
  const handleCaptchaToken = useCallback((token) => setCaptchaToken(token), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setStatus('captcha');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, captchaToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else if (data.error?.toLowerCase().includes('already') || data.error?.toLowerCase().includes('exists')) {
        setStatus('duplicate');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const disabled = status === 'loading' || status === 'success';

  return (
    <section className="py-16 md:py-24 bg-stone-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Red banner */}
          {captchaToken && (
            <div className="bg-red-700 px-6 py-5 md:py-6 text-center">
              <h2 className="text-lg md:text-2xl font-extrabold text-white uppercase tracking-tight">
                {t('newsletter.title')}
              </h2>
            </div>
          )}

          {/* Form */}
          <div className="px-6 md:px-12 py-8 md:py-10 text-center">
            {!captchaToken ? (
              <div className="max-w-sm mx-auto">
                <AuthCaptcha onTokenChange={handleCaptchaToken} />
              </div>
            ) : (
              <>
                <p className="text-slate-600 mb-6 md:mb-8 text-base md:text-lg">{t('newsletter.subtitle')}</p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4 max-w-2xl mx-auto">
                  <input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={disabled}
                    aria-label={t('newsletter.placeholder')}
                    className="flex-1 w-full px-5 md:px-6 py-3.5 md:py-4 rounded-full border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-200 text-base md:text-lg disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={disabled}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300 focus-visible:ring-offset-2"
                  >
                    {status === 'loading'
                      ? t('newsletter.sending')
                      : status === 'success'
                        ? t('newsletter.subscribed')
                        : t('newsletter.submit')}
                  </button>
                </form>

                <p className="mt-4 text-xs text-slate-400">{t('newsletter.trust')}</p>
              </>
            )}

            <StatusMessage status={status} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusMessage({ status }) {
  const { t } = useTranslation();

  const config = {
    success:   { bg: 'bg-green-100 text-green-700', key: 'newsletter.success' },
    duplicate: { bg: 'bg-yellow-100 text-yellow-800', key: 'newsletter.duplicate' },
    captcha:   { bg: 'bg-red-100 text-red-700', key: 'newsletter.captchaRequired' },
    error:     { bg: 'bg-red-100 text-red-700', key: 'newsletter.error' },
  };

  const c = config[status];
  if (!c) return <div className="mt-6 h-8" />;

  return (
    <div className="mt-6 h-8 flex items-center justify-center">
      <span className={`${c.bg} px-6 py-2 rounded-full font-medium text-sm`}>
        {t(c.key)}
      </span>
    </div>
  );
}

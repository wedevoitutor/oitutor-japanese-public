import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SubscriptionCancelPage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-24">
      <div className="max-w-md text-center bg-white p-10 rounded-3xl shadow-lg border border-slate-100">
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          {t('subscription.cancel.title')}
        </h1>
        <p className="text-slate-600 mb-8">{t('subscription.cancel.message')}</p>
        <Link
          to="/subscription"
          className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-full transition-colors"
        >
          {t('subscription.cancel.cta')}
        </Link>
      </div>
    </main>
  );
}

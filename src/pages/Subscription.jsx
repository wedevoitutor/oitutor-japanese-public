import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PlanCard from '../components/ui/PlanCard';
import { startCheckout } from '../lib/subscriptionService';

export default function Subscription() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleFree = () => navigate('/login');

  const handlePremium = async () => {
    setLoadingPlan('premium');
    try {
      await startCheckout();
    } catch (err) {
      console.error('Checkout error:', err.message);
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-white py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/japanese-sayagata.png")' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {t('subscription.pageTitle')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('subscription.pageSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          <PlanCard
            titleKey="subscription.plans.free.title"
            priceKey="subscription.plans.free.price"
            featuresKeys={[
              'subscription.features.basicLessons',
              'subscription.features.limitedHearts',
              'subscription.features.adsIncluded',
            ]}
            onSelect={handleFree}
          />

          <PlanCard
            titleKey="subscription.plans.premium.title"
            priceKey="subscription.plans.premium.price"
            originalPriceKey="subscription.plans.premium.originalPrice"
            periodKey="subscription.plans.premium.period"
            badgeKey="subscription.launchSaleBadge"
            featuresKeys={[
              'subscription.features.allLessons',
              'subscription.features.personalizedLessons',
              'subscription.features.specificContent',
              'subscription.features.noAds',
              'subscription.features.offlineMode',
            ]}
            isPopular
            onSelect={handlePremium}
            isLoading={loadingPlan === 'premium'}
          />
        </div>
      </div>
    </main>
  );
}

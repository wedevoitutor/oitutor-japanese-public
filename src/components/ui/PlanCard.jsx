import { useTranslation } from 'react-i18next';

/**
 * Subscription plan card.
 * @param {Object} props
 * @param {string} props.titleKey - i18n key for plan name.
 * @param {string} props.priceKey - i18n key for current price.
 * @param {string} [props.originalPriceKey] - i18n key for struck-through pre-sale price.
 * @param {string} [props.periodKey] - i18n key for billing period (e.g. "/month").
 * @param {string[]} props.featuresKeys - i18n keys for feature list.
 * @param {boolean} [props.isPopular=false] - Highlights the plan.
 * @param {string} [props.badgeKey] - i18n key for badge text (overrides default "Popular").
 * @param {Function} props.onSelect - Called on button click.
 * @param {boolean} [props.isLoading=false] - Disables the button.
 */
export default function PlanCard({
  titleKey,
  priceKey,
  originalPriceKey,
  periodKey,
  featuresKeys,
  isPopular = false,
  badgeKey,
  onSelect,
  isLoading = false,
}) {
  const { t } = useTranslation();
  const badgeText = badgeKey ? t(badgeKey) : t('subscription.popularBadge');

  return (
    <div className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all ${
      isPopular
        ? 'border-red-600 shadow-xl scale-105 bg-white z-10'
        : 'border-slate-200 shadow-sm bg-slate-50 hover:border-red-300'
    }`}>
      {isPopular && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 text-sm font-bold rounded-full uppercase tracking-wide">
          {badgeText}
        </span>
      )}

      <h3 className="text-2xl font-bold text-slate-900 mb-2">{t(titleKey)}</h3>
      <div className="flex items-baseline gap-2 mb-6">
        {originalPriceKey && (
          <span className="text-2xl font-medium text-slate-400 line-through">
            {t(originalPriceKey)}
          </span>
        )}
        <span className="text-4xl font-extrabold text-slate-900">{t(priceKey)}</span>
        {periodKey && <span className="text-slate-500 font-medium">{t(periodKey)}</span>}
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {featuresKeys.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-slate-700">
            <span className="text-green-500 shrink-0">✓</span>
            <span>{t(feature)}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={isLoading}
        className={`w-full py-4 rounded-full font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isPopular
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
      >
        {isLoading ? t('common.loading') : t('subscription.selectPlan')}
      </button>
    </div>
  );
}

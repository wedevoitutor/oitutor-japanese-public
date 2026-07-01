import { useTranslation } from 'react-i18next';

/**
 * Card for a shop product — dark theme with glassmorphism.
 * @param {{ icon: string, titleKey: string, descKey: string, priceKey: string, tagKey: string, available?: boolean, index?: number, onBuy?: function }} props
 */
export default function ProductCard({ icon, titleKey, descKey, priceKey, tagKey, available = false, index = 0, onBuy }) {
  const { t } = useTranslation();

  return (
    <div
      className="card-entrance relative flex flex-col p-5 md:p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {!available && (
        <span className="absolute top-3 right-3 text-[10px] md:text-xs font-bold bg-amber-400/10 text-amber-400/90 border border-amber-400/20 px-2 py-0.5 rounded-full">
          {t('shop.comingSoon')}
        </span>
      )}

      <div className="text-3xl md:text-4xl mb-3">{icon}</div>

      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-red-400/80 mb-2">
        {t(tagKey)}
      </span>

      <h3 className="text-base md:text-lg font-bold text-white mb-2">{t(titleKey)}</h3>
      <p className="text-white/40 text-xs md:text-sm flex-1 mb-5 md:mb-6">{t(descKey)}</p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl md:text-2xl font-extrabold text-white">{t(priceKey)}</span>
        <button
          onClick={onBuy}
          disabled={!available}
          className="px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/20 transition-all hover:from-red-700 hover:to-red-600 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {available ? t('shop.buyNow') : t('shop.comingSoon')}
        </button>
      </div>
    </div>
  );
}

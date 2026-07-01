import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ui/ProductCard';
import { SHOP_PRODUCTS } from '../content/shopProducts';
import { createStripeCheckout } from '../lib/checkout';

export default function ShopPage() {
  const { t } = useTranslation();

  const handleBuy = async (product) => {
    try {
      const { url } = await createStripeCheckout(product.id);
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Decorative watermark */}
      <span className="absolute top-20 -left-10 text-[16rem] font-black text-white/[.02] select-none pointer-events-none rotate-12" aria-hidden>
        店
      </span>
      <span className="absolute bottom-10 -right-8 text-[12rem] font-black text-white/[.02] select-none pointer-events-none -rotate-6" aria-hidden>
        本
      </span>

      {/* Hero */}
      <div className="relative z-10 pt-20 md:pt-28 pb-12 md:pb-16 px-4 md:px-6 text-center">
        <div className="h-0.5 w-24 mx-auto mb-8 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {t('shop.pageTitle')}
        </h1>
        <p className="text-base md:text-xl text-white/50 max-w-2xl mx-auto mb-6">
          {t('shop.pageSubtitle')}
        </p>
        <p className="inline-block text-xs md:text-sm font-medium text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full">
          {t('shop.paymentNotice')}
        </p>
      </div>

      {/* Products */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SHOP_PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              {...product}
              index={i}
              onBuy={() => handleBuy(product)}
            />
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 text-2xl text-white/20">
            <span title="Stripe">💳</span>
            <span title="Bitcoin">₿</span>
            <span title="Ethereum">Ξ</span>
          </div>
          <p className="text-xs md:text-sm text-white/30">{t('shop.paymentMethods')}</p>
        </div>
      </div>
    </main>
  );
}

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/**
 * Componente genérico para páginas em construção.
 * * @param {Object} props
 * @param {string} [props.titleKey="placeholder.defaultTitle"] - Chave do título.
 * @param {string} [props.descKey="placeholder.defaultDesc"] - Chave da descrição.
 */
export default function Placeholder({ 
  titleKey = 'placeholder.defaultTitle', 
  descKey = 'placeholder.defaultDesc' 
}) {
  const { t } = useTranslation();

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6 animate-bounce">🚧</div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
        {t(titleKey)}
      </h1>
      <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
        {t(descKey)}
      </p>
      
      <Link 
        to="/" 
        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
      >
        {t('common.backToHome')}
      </Link>
    </main>
  );
}
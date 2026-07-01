import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isEN = i18n.language === 'en';

  const toggle = () => {
    const next = isEN ? 'pt' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('oitutor_lang', next);
  };

  const next = isEN ? 'pt' : 'gb';
  return (
    <button
      onClick={toggle}
      className="px-1.5 py-1 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
      aria-label="Switch language"
    >
      <img
        src={`https://flagcdn.com/${next}.svg`}
        width="20"
        height="15"
        alt={isEN ? 'Switch to Portuguese' : 'Switch to English'}
      />
    </button>
  );
}

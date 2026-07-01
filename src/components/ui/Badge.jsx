import { useTranslation } from 'react-i18next';

const STATUS_STYLES = {
  available: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  locked: 'bg-slate-100 text-slate-500',
  comingSoon: 'bg-slate-100 text-slate-500',
};

const TYPE_STYLES = {
  study: 'bg-red-100 text-red-700',
  practice: 'bg-rose-100 text-rose-700',
  grammar: 'bg-red-200 text-red-800',
  dialogue: 'bg-pink-100 text-pink-700',
  kanji: 'bg-amber-100 text-amber-700',
  review: 'bg-orange-100 text-orange-700',
};

export default function Badge({ variant = 'status', value }) {
  const { t } = useTranslation();
  const styles = variant === 'type' ? TYPE_STYLES : STATUS_STYLES;
  const label = t(`badges.${value}`, value);

  return (
    <span
      className={`inline-flex items-center text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
        styles[value] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {label}
    </span>
  );
}

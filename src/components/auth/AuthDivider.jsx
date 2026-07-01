import { useTranslation } from 'react-i18next';

export default function AuthDivider() {
  const { t } = useTranslation();

  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/14" aria-hidden="true" />
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300/66">
        {t('auth.or')}
      </span>
      <span className="h-px flex-1 bg-white/14" aria-hidden="true" />
    </div>
  );
}

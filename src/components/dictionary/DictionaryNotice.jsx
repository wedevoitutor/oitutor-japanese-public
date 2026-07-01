import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

/**
 * First-visit notice explaining the current dictionary language scope.
 *
 * @param {object} props
 * @param {() => void} props.onDismiss
 */
export default function DictionaryNotice({ onDismiss }) {
  const { t } = useTranslation();

  return (
    <aside className="flex items-start gap-3 rounded-3xl border border-violet-200 bg-violet-50 p-4 text-violet-950 shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{t('dictionary.noticeTitle')}</p>
        <p className="mt-1 text-sm leading-6 text-violet-900">{t('dictionary.noticeBody')}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-violet-700 transition-colors hover:bg-violet-100"
        aria-label={t('dictionary.dismissNotice')}
      >
        <FaTimes aria-hidden />
      </button>
    </aside>
  );
}

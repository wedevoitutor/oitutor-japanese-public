import { useTranslation } from 'react-i18next';
import { useProgress } from '../../context/ProgressContext';
import { useSession } from '../../hooks/useSession';
import BadgeCard from './BadgeCard';

export default function BadgesSection() {
  const { t } = useTranslation();
  const session = useSession();
  const { badges } = useProgress();
  if (!session) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold text-[#1a1613] mb-4 font-serif">{t('profile.badges')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((b) => (
          <BadgeCard key={b.id} {...b} />
        ))}
      </div>
    </section>
  );
}

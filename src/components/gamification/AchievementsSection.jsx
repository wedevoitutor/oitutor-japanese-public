import { useTranslation } from 'react-i18next';
import { useProgress } from '../../context/ProgressContext';
import { useSession } from '../../hooks/useSession';
import AchievementCard from './AchievementCard';

export default function AchievementsSection() {
  const { t } = useTranslation();
  const session = useSession();
  const { achievements } = useProgress();
  if (!session) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold text-[#1a1613] mb-4 font-serif">{t('profile.achievements')}</h2>
      <div className="grid gap-3">
        {achievements.map((a) => (
          <AchievementCard key={a.id} {...a} />
        ))}
      </div>
    </section>
  );
}

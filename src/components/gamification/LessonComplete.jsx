import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function LessonComplete({ xpEarned, nextLessonPath }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('exercise.complete')}</h2>
      <p className="text-lg text-amber-600 font-semibold mb-8">
        +{xpEarned} {t('exercise.xpEarned')}
      </p>
      <div className="flex gap-4">
        {nextLessonPath && (
          <Button onClick={() => navigate(nextLessonPath)}>
            {t('exercise.nextLesson')}
          </Button>
        )}
        <Button variant="secondary" onClick={() => navigate('/curriculum')}>
          {t('exercise.backToCourse')}
        </Button>
      </div>
    </div>
  );
}

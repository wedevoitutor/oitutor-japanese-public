import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLesson, findLessonMeta, findNextLessonPath, useAllLessonIds } from '../hooks/useLesson';
import useLessonProgress from '../hooks/useLessonProgress';
import { useProgress } from '../context/ProgressContext';
import { useSession } from '../hooks/useSession';
import { calcXP } from '../lib/xp';
import { playComplete } from '../lib/sounds';
import { stopAll as stopAllAudio } from '../lib/audioBus';
import ExerciseShell from '../components/exercise/ExerciseShell';
import ExerciseRenderer from '../components/exercise/ExerciseRenderer';
import SumiMurasakiGrammarLesson, { SumiMurasakiLessonComplete } from '../components/exercise/SumiMurasakiGrammarLesson';
import LessonBanner from '../components/exercise/LessonBanner';
import LessonComplete from '../components/gamification/LessonComplete';
import LessonCheatsheet from '../components/gamification/LessonCheatsheet';
import BackLink from '../components/layout/BackLink';
import { getSectionTheme, isThemeEnabled, isBannerEnabled } from '../lib/sectionThemes';

function lessonNumberFromId(id, fallback = '01') {
  return id?.match(/-(\d+)$/)?.[1] || fallback;
}

function lessonTopic(title, prefixPattern) {
  return title?.replace(prefixPattern, '').trim() || title || '';
}

export default function LessonPage() {
  const { t } = useTranslation();
  const { sectionSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const meta = findLessonMeta(sectionSlug, lessonSlug);
  const { data, loading, error } = useLesson(meta?.lesson?.contentFile);
  const { completeLesson } = useProgress();
  const allLessonIds = useAllLessonIds();
  const session = useSession();
  const isFree = meta ? allLessonIds.indexOf(meta.lesson.id) === 0 : false;

  useEffect(() => {
    if (!meta || isFree || session === undefined) return;
    if (session === null) navigate('/login');
  }, [meta, isFree, session, navigate]);

  const { progress, update, clear } = useLessonProgress(sectionSlug, lessonSlug);
  const { currentIdx, correctCount, maxReachedIdx } = progress;
  const lessonKey = `${sectionSlug}/${lessonSlug}`;
  const [completedLessonKey, setCompletedLessonKey] = useState(null);
  const done = completedLessonKey === lessonKey;

  useEffect(() => () => stopAllAudio(), []);

  useEffect(() => {
    if (done) window.scrollTo(0, 0);
  }, [done]);

  const exercises = data?.exercises || [];
  const xp = useMemo(() => calcXP(meta?.lesson?.type, correctCount === exercises.length), [meta, correctCount, exercises.length]);

  const nextPath = useMemo(
    () => (meta ? findNextLessonPath(meta.lesson.id) : null),
    [meta],
  );

  const handleComplete = ({ correct }) => {
    const isNewGround = currentIdx === maxReachedIdx;
    const newCorrectCount = isNewGround && correct ? correctCount + 1 : correctCount;
    const nextIdx = currentIdx + 1;
    const newMaxReached = Math.max(maxReachedIdx, nextIdx);
    if (nextIdx < exercises.length) {
      update({ currentIdx: nextIdx, correctCount: newCorrectCount, maxReachedIdx: newMaxReached });
    } else {
      setCompletedLessonKey(lessonKey);
      playComplete();
      if (meta?.lesson) {
        const isPerfect = newCorrectCount === exercises.length;
        completeLesson(meta.lesson.id, xp, isPerfect);
      }
      clear();
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) update({ currentIdx: currentIdx - 1 });
  };

  const handleForward = () => {
    if (currentIdx < maxReachedIdx) update({ currentIdx: currentIdx + 1 });
  };

  if (!meta) return <div className="text-center py-20 text-slate-500">Lesson not found.</div>;
  if (!isFree && session === undefined) return <div className="text-center py-20 text-slate-400">Loading...</div>;
  if (loading) return <div className="text-center py-20 text-slate-400">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading lesson.</div>;

  const isSumiMurasakiGrammar = meta.lesson.type === 'grammar' && data?.id?.startsWith('grammar-lesson-');
  const isSumiMurasakiKanji = sectionSlug === 'kanji' && data?.id?.startsWith('kanji-');
  const isSumiMurasakiDialogue = sectionSlug === 'dialogues' && data?.id?.startsWith('dialogues-lesson-');
  const isSumiMurasakiLesson = isSumiMurasakiGrammar || isSumiMurasakiKanji || isSumiMurasakiDialogue;
  const isKanjiReview = meta.lesson.id === 'kanji-n5-review';
  const grammarLessonNo = lessonNumberFromId(meta.lesson.id);
  const grammarTopic = lessonTopic(meta.lesson.title, /^Grammar\s+\d+\s+-\s*/i);
  const kanjiLessonNo = lessonNumberFromId(meta.lesson.id);
  const kanjiTopic = lessonTopic(meta.lesson.title, /^Kanji\s+-\s*/i);
  const dialogueLessonNo = lessonNumberFromId(meta.lesson.id);
  const dialogueTopic = lessonTopic(meta.lesson.title, /^Lesson\s+\d+\s+-\s*/i);
  const sumiLabels = isSumiMurasakiKanji
    ? {
        lessonLabel: isKanjiReview ? 'Kanji · N5 Review' : `Kanji · Batch ${kanjiLessonNo}`,
        headerKanji: '漢字',
        headerMeta: isKanjiReview ? 'All 80 N5 Kanji' : kanjiTopic,
        completeHeader: isKanjiReview ? 'N5 Kanji Review · Complete' : `Kanji ${kanjiLessonNo} · Complete`,
        completeText: isKanjiReview
          ? 'The full N5 kanji review is sealed. Keep cycling the flashcards and meaning matches to maintain recognition.'
          : 'This N5 kanji batch is sealed. Review the reference card, then keep building recognition and readings.',
        accent: {
          light: '#e0e7ff',
          mid: '#a5b4fc',
          accent: '#6366f1',
          deep: '#1d4ed8',
          ink: '#3730a3',
          shadow: 'rgba(99,102,241,0.4)',
        },
      }
    : isSumiMurasakiDialogue
      ? {
          lessonLabel: `Kaiwa · Lesson ${dialogueLessonNo}`,
          headerKanji: '会話',
          headerMeta: `Dialogue ${dialogueLessonNo} · ${dialogueTopic}`,
          completeHeader: `Dialogue ${dialogueLessonNo} · Complete`,
          completeText: `${dialogueTopic} practice is sealed. Review the register card, then keep shadowing the lines aloud.`,
          accent: {
            light: '#ccfbf1',
            mid: '#5eead4',
            accent: '#14b8a6',
            deep: '#047857',
            ink: '#0f766e',
            shadow: 'rgba(20,184,166,0.4)',
          },
        }
    : {
        lessonLabel: `Bunpō · Lesson ${grammarLessonNo}`,
        headerKanji: '文法',
        headerMeta: `Grammar ${grammarLessonNo} · ${grammarTopic}`,
        completeHeader: `Grammar ${grammarLessonNo} · Complete`,
        completeText: `${grammarTopic} is complete. Review the reference cards when needed, then continue to the next grammar step.`,
        accent: undefined,
      };

  if (done) {
    const charts = exercises.filter((ex) => ex.type === 'reference-chart');

    if (isSumiMurasakiLesson) {
      return (
        <div className="min-h-screen bg-[#f6f1e6] py-6">
          <div className="max-w-2xl mx-auto px-4 mb-4">
            <BackLink to="/curriculum" label={t('exercise.backToCourse')} />
          </div>
          <div className="max-w-2xl mx-auto px-4">
            <SumiMurasakiLessonComplete
              xpEarned={xp}
              nextLessonPath={nextPath}
              total={exercises.length}
              charts={charts}
              lessonLabel={sumiLabels.lessonLabel}
              headerKanji={sumiLabels.headerKanji}
              headerMeta={sumiLabels.completeHeader}
              completeText={sumiLabels.completeText}
              accent={sumiLabels.accent}
              onNextLesson={() => nextPath && navigate(nextPath)}
              onBackToCourse={() => navigate('/curriculum')}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <LessonComplete xpEarned={xp} nextLessonPath={nextPath} />
        {charts.length > 0 && <LessonCheatsheet charts={charts} />}
      </div>
    );
  }

  const theme = isThemeEnabled(sectionSlug, lessonSlug) ? getSectionTheme(sectionSlug) : null;
  const showBanner = isBannerEnabled(sectionSlug);

  if (isSumiMurasakiLesson) {
    return (
      <div className="min-h-screen bg-[#f6f1e6] py-6">
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <BackLink to="/curriculum" label={t('exercise.backToCourse')} />
        </div>
        <div className="max-w-2xl mx-auto px-4">
          <SumiMurasakiGrammarLesson
            key={currentIdx}
            exercise={exercises[currentIdx]}
            current={currentIdx + 1}
            total={exercises.length}
            lessonLabel={sumiLabels.lessonLabel}
            headerKanji={sumiLabels.headerKanji}
            headerMeta={sumiLabels.headerMeta}
            accent={sumiLabels.accent}
            onComplete={handleComplete}
            onBack={handleBack}
            onForward={handleForward}
            canBack={currentIdx > 0}
            canForward={currentIdx < maxReachedIdx}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme?.bg ?? ''} relative overflow-hidden ${theme ? 'min-h-screen' : ''}`}>
      {theme && (
        <>
          <span className={`absolute top-20 -left-6 text-[14rem] font-black ${theme.watermarkColor} select-none pointer-events-none rotate-12`} aria-hidden>
            {theme.kanji[0]}
          </span>
          <span className={`absolute bottom-20 -right-8 text-[12rem] font-black ${theme.watermarkColor} select-none pointer-events-none -rotate-6`} aria-hidden>
            {theme.kanji[1]}
          </span>
        </>
      )}

      <div className="relative z-10">
        {showBanner ? (
          <LessonBanner lessonId={meta.lesson.id} backTo="/curriculum" />
        ) : (
          <div className="max-w-2xl mx-auto px-4 pt-6">
            <BackLink to="/curriculum" label={t('exercise.backToCourse')} />
          </div>
        )}
        <div className="max-w-2xl mx-auto px-4">
          {theme && <div className={`h-0.5 w-24 mb-4 ${theme.accentLine}`} />}
          <h2 className="text-lg font-bold text-slate-900 mb-2">{meta.lesson.title}</h2>
        </div>
        <ExerciseShell
          current={currentIdx + 1}
          total={exercises.length}
          onBack={handleBack}
          onForward={handleForward}
          canBack={currentIdx > 0}
          canForward={currentIdx < maxReachedIdx}
        >
          <ExerciseRenderer
            key={currentIdx}
            exercise={exercises[currentIdx]}
            onComplete={handleComplete}
            manualAdvance={meta?.lesson?.type === 'grammar'}
          />
        </ExerciseShell>
      </div>
    </div>
  );
}

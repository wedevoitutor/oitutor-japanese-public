import { useRef } from 'react';
import Flashcard from './Flashcard';
import TypeTheAnswer from './TypeTheAnswer';
import MultipleChoice from './MultipleChoice';
import MatchingGame from './MatchingGame';
import FillInTheBlank from './FillInTheBlank';
import ListeningComprehension from './ListeningComprehension';
import ListenAndOrder from './ListenAndOrder';
import ResponseSelection from './ResponseSelection';
import ReferenceChart from './ReferenceChart';
import HiraganaBuild from './HiraganaBuild';
import FormulaFill from './FormulaFill';
import ComparisonCards from './ComparisonCards';
import DialogueScene from './DialogueScene';
import Shadowing from './Shadowing';
import KanjiCard from './KanjiCard';
import ReadingExplanation from './ReadingExplanation';
import ReadingPractice from './ReadingPractice';
import { playCorrect, playWrong } from '../../lib/sounds';

const COMPONENTS = {
  flashcard: Flashcard,
  'type-the-answer': TypeTheAnswer,
  'multiple-choice': MultipleChoice,
  matching: MatchingGame,
  'fill-in-the-blank': FillInTheBlank,
  listening: ListeningComprehension,
  'listen-and-order': ListenAndOrder,
  'response-selection': ResponseSelection,
  'reference-chart': ReferenceChart,
  'hiragana-build': HiraganaBuild,
  'formula-fill': FormulaFill,
  'comparison-cards': ComparisonCards,
  'dialogue-scene': DialogueScene,
  shadowing: Shadowing,
  'kanji-card': KanjiCard,
  'reading-explanation': ReadingExplanation,
  'reading-practice': ReadingPractice,
};

const UNGRADED = new Set([
  'reference-chart',
  'flashcard',
  'dialogue-scene',
  'shadowing',
  'kanji-card',
  'reading-practice',
]);

export default function ExerciseRenderer({ exercise, onComplete, manualAdvance = false }) {
  const feedbackPlayedRef = useRef(false);
  const Component = COMPONENTS[exercise.type];
  if (!Component) {
    return <p className="text-red-500 text-center">Unknown exercise type: {exercise.type}</p>;
  }

  const playFeedback = (result) => {
    if (!UNGRADED.has(exercise.type)) {
      if (result?.correct) {
        playCorrect();
        feedbackPlayedRef.current = true;
      } else if (result?.correct === false) {
        playWrong();
        feedbackPlayedRef.current = true;
      }
    }
  };

  const handleAnswerFeedback = (result) => {
    playFeedback(result);
  };

  const handleComplete = (result) => {
    if (!feedbackPlayedRef.current) playFeedback(result);
    onComplete?.(result);
  };

  return (
    <Component
      {...exercise}
      onComplete={handleComplete}
      onAnswerFeedback={handleAnswerFeedback}
      manualAdvance={manualAdvance}
    />
  );
}

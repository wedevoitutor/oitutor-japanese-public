import MultipleChoice from './MultipleChoice';
import SpeakButton from '../ui/SpeakButton';

// JSON shape:
// { type: "listening", speakText: "...", prompt: "...", options: [...], correctIndex: N }
export default function ListeningComprehension({
  speakText,
  prompt,
  options,
  correctIndex,
  onComplete,
  onAnswerFeedback,
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <SpeakButton text={speakText} size="md" autoPlay showWarning />
      <MultipleChoice
        prompt={prompt}
        options={options}
        correctIndex={correctIndex}
        onComplete={onComplete}
        onAnswerFeedback={onAnswerFeedback}
      />
    </div>
  );
}

import MultipleChoice from './MultipleChoice';

export default function ResponseSelection({
  context,
  options,
  correctIndex,
  onComplete,
  onAnswerFeedback,
}) {
  return (
    <MultipleChoice
      prompt={context}
      options={options}
      correctIndex={correctIndex}
      onComplete={onComplete}
      onAnswerFeedback={onAnswerFeedback}
    />
  );
}

import DictionaryMeaningGroup from './DictionaryMeaningGroup';

/**
 * Backward-compatible dictionary word card wrapper.
 *
 * @param {object} props
 * @param {import('../../lib/dictionary').DictionaryEntry} props.entry
 */
export default function WordCard({ entry }) {
  return <DictionaryMeaningGroup entry={entry} />;
}

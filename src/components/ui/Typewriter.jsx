import { useState, useEffect } from 'react';

export default function Typewriter({ words = [], className = 'text-red-600' }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const full = words[wordIdx];

    const timer = setTimeout(
      () => {
        if (!deleting) {
          setText(full.substring(0, text.length + 1));
          if (text === full) setTimeout(() => setDeleting(true), 2000);
        } else {
          setText(full.substring(0, text.length - 1));
          if (text === '') {
            setDeleting(false);
            setWordIdx((i) => (i + 1) % words.length);
          }
        }
      },
      deleting ? 100 : 150,
    );
    return () => clearTimeout(timer);
  }, [text, deleting, wordIdx, words]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      {text}
      <span className="animate-pulse ml-1 font-light">|</span>
    </span>
  );
}

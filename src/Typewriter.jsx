import { useState, useEffect } from 'react';

// 1. Movemos a constante para fora do componente!
const words = ["Autêntica", "Não sei como é", "本物の"]; 

export default function Typewriter() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const pauseTime = 2000;

    const handleTyping = () => {
      const fullWord = words[currentWordIndex];

      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        if (currentText === fullWord) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]); // 'words' não precisa mais estar aqui

  return (
    <span className="text-red-600 inline-flex items-center">
      {currentText}
      <span className="animate-pulse ml-1 font-light text-red-500">|</span>
    </span>
  );
}
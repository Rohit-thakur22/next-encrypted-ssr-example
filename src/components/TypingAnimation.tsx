'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function TypingAnimation({ text, className = '', style }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 50); // Adjust speed here (lower = faster)

    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.h1 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
      style={style}
    >
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block ml-1 w-1 h-10 bg-gradient-to-b from-white to-transparent"
        />
      )}
    </motion.h1>
  );
}


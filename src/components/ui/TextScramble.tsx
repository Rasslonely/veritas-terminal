"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

interface TextScrambleProps {
  text: string;
  duration?: number;
  className?: string;
}

export function TextScramble({ text, duration = 2, className }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(true);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / (duration * 2); // Control speed
    }, 30);

    return () => clearInterval(interval);
  }, [text, duration]);

  return (
    <motion.span 
        className={className} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
    >
      {displayText}
    </motion.span>
  );
}

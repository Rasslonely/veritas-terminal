"use client";

import { useEffect, useState } from "react";

export function MatrixLog({ message }: { message: string }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + message.charAt(i));
      i++;
      if (i >= message.length) clearInterval(interval);
    }, 30); // Typing speed
    
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="font-mono text-xs text-green-500 bg-black/50 p-2 rounded border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
      <span className="mr-2">&gt;</span>
      {displayedText}
      <span className="animate-pulse">_</span>
    </div>
  );
}

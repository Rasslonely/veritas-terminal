"use client";

import { useCallback } from "react";

export function useHaptic() {
  const trigger = useCallback((pattern: number | number[] = 10) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  return {
    impact: {
      light: () => trigger(10),
      medium: () => trigger(20),
      heavy: () => trigger(40),
    },
    notification: {
      success: () => trigger([10, 30, 10]),
      error: () => trigger([50, 50, 50]),
      warning: () => trigger([30, 30]),
    },
    vibrate: trigger,
  };
}

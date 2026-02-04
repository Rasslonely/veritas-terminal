"use client";

import { useCallback } from "react";

type HapticType = "selection" | "success" | "error" | "impact" | "heavy";

export function useHaptics() {
  const triggerHaptic = useCallback((type: HapticType = "selection") => {
    if (typeof window === "undefined" || !window.navigator?.vibrate) return;

    switch (type) {
      case "selection":
        window.navigator.vibrate(10); // Light tap
        break;
      case "impact":
        window.navigator.vibrate(20); // Firm tap
        break;
      case "heavy":
        window.navigator.vibrate(40); // Heavy tap
        break;
      case "success":
        window.navigator.vibrate([10, 30, 10]); // Double tap
        break;
      case "error":
        window.navigator.vibrate([50, 100, 50, 100]); // Long buzz
        break;
    }
  }, []);

  return { triggerHaptic };
}

"use client";

import { useCallback, useRef, useEffect } from "react";

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction or mount
    // Note: AudioContext usually needs a user gesture to start.
    const init = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioCtxRef.current = new AudioContext();
            }
        }
    };
    
    // Attempt init
    init();
    window.addEventListener('click', init, { once: true });
    return () => window.removeEventListener('click', init);
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  const playClick = useCallback(() => {
    playTone(800, "sine", 0.05, 0.05); // Subtle blip
  }, [playTone]);

  const playSuccess = useCallback(() => {
    if (!audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    // Major Triad Arpeggio
    setTimeout(() => playTone(523.25, "sine", 0.1, 0.1), 0);   // C5
    setTimeout(() => playTone(659.25, "sine", 0.1, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, "sine", 0.2, 0.1), 200); // G5
  }, [playTone]);

  const playError = useCallback(() => {
    if (!audioCtxRef.current) return;
    // Descending Sawtooth
    playTone(150, "sawtooth", 0.3, 0.1);
    setTimeout(() => playTone(100, "sawtooth", 0.3, 0.1), 100);
  }, [playTone]);

  const playScan = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "square";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  return {
    playClick,
    playSuccess,
    playError,
    playScan
  };
}

import { useCallback, useEffect, useRef } from "react";

export const useAudioPlayer = (source, { preload = false } = {}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const player = new Audio(source);
    player.preload = preload ? "auto" : "metadata";
    player.load();
    audioRef.current = player;
    return () => {
      player.pause();
      audioRef.current = null;
    };
  }, [preload, source]);

  const unlock = useCallback((onUnlocked, onFailure) => {
    const player = audioRef.current;
    if (!player) return;
    player
      .play()
      .then(() => {
        onUnlocked();
      })
      .catch(onFailure);
  }, []);

  const playFromStart = useCallback((onFailure = () => {}) => {
    const player = audioRef.current;
    if (!player) return;
    player.currentTime = 0;
    player.play().catch(onFailure);
  }, []);

  return { unlock, playFromStart };
};

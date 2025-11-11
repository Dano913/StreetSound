import { useEffect, useRef, useState, useCallback } from 'react'; 
import { Song } from '../types';

export const useAudioPlayer = (onEnded?: () => void) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoop, setIsLoop] = useState(false); // ← ESTADO PARA LOOP

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current!;
    audio.preload = 'metadata';

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEndedHandler = () => {
      // Si está en loop, reiniciar la canción
      if (isLoop && audio) {
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        // Si no está en loop, pasar a la siguiente
        setIsPlaying(false);
        if (onEnded) onEnded();
      }
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEndedHandler);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEndedHandler);
    };
  }, [onEnded, isLoop]); // ← isLoop en dependencias

  // Actualizar la propiedad loop del audio cuando cambie isLoop
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop]);

  const playSong = useCallback((song: Song) => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current!;
    setCurrentSong(song);
    const src = (song as any).url ?? (song as any).src ?? '';
    if (audio.src !== src) {
      audio.pause();
      audio.src = src;
      audio.loop = isLoop; // ← Aplicar loop al cargar nueva canción
      try { audio.load(); } catch {}
      try { audio.currentTime = 0; } catch {}
    }
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(() => {
      setIsPlaying(true);
    });
  }, [volume, isLoop]); // ← isLoop en dependencias

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || isNaN(time)) return;
    try { audio.currentTime = time; } catch {}
    setCurrentTime(time);
  }, []);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const toggleLoop = useCallback((newLoopState: boolean) => {
    setIsLoop(newLoopState);
  }, []);

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoop, // ← EXPORTAR estado
    playSong,
    togglePlayPause,
    seek,
    changeVolume,
    toggleLoop, // ← EXPORTAR función
  };
};

export default useAudioPlayer;
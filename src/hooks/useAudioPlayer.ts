import { useEffect, useRef, useState, useCallback } from 'react'; 
import { Song } from '../types';

export const useAudioPlayer = (onEnded?: () => void) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current!;
    audio.preload = 'metadata';

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEndedHandler = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEndedHandler);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEndedHandler);
    };
  }, [onEnded]);

  const playSong = useCallback((song: Song) => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current!;
    setCurrentSong(song);
    const src = (song as any).url ?? (song as any).src ?? '';
    if (audio.src !== src) {
      audio.pause();
      audio.src = src;
      try { audio.load(); } catch {}
      try { audio.currentTime = 0; } catch {}
    }
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(() => {
      // autoplay blocked by browser — still mark as playing so UI updates
      setIsPlaying(true);
    });
  }, [volume]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        // ignore
      });
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

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playSong,
    togglePlayPause,
    seek,
    changeVolume,
  };
};

export default useAudioPlayer;

import { useEffect, RefObject } from 'react';
import { Song } from '../types';

export interface UseAudioElementProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  onNext: () => void;
  onSeek: (time: number) => void;
}

export const useAudioElement = ({
  audioRef,
  currentSong,
  isPlaying,
  volume,
  onNext,
  onSeek,
}: UseAudioElementProps) => {

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Establecemos la fuente y volumen
    audio.src = currentSong ? currentSong.url ?? currentSong.src ?? '' : '';
    audio.volume = volume;

    // Manejadores de eventos
    const handleEnded = () => {
      onNext(); // Cambia a la siguiente canción
    };

    const handleTimeUpdate = () => {
      onSeek(audio.currentTime);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    // Reproducir o pausar según isPlaying
    if (isPlaying && currentSong) {
      audio.play().catch(() => {
        // Autoplay bloqueado por el navegador, pero seguimos marcando isPlaying
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentSong, isPlaying, volume, onNext, onSeek]);
};

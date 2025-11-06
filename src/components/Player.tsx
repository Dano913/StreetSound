import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle } from 'lucide-react';
import { PlayerProps } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useState, useRef } from 'react';
import { useAudioElement } from '../hooks/useAudioElement';

export const Player = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onNext,
  onPrevious,
  onToggleShuffle,
}: PlayerProps) => {
  const { isDark } = useTheme();
  const [isShuffling, setIsShuffling] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useAudioElement({ audioRef, currentSong, isPlaying, volume, onNext, onSeek });

  const toggleShuffle = () => {
    const newState = !isShuffling;
    setIsShuffling(newState);
    onToggleShuffle?.(newState);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`border-t-2 shadow-lg transition-colors ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="max-w-8xl mx-auto flex h-[150px] items-center gap-3 border-1 border-green-500">
        <div className="border-1 border-blue-500 w-[500px] flex justify-center">
        {currentSong?.cover && (
          <div className="w-[130px] h-[130px] rounded-lg overflow-hidden shadow-md">
            <img
              src={currentSong.cover?.startsWith('/src/assets/')
                ? new URL(`../${currentSong.cover.replace('/src/', '')}`, import.meta.url).href
                : currentSong.cover}
              alt="Carátula del álbum"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        </div>
        <div className="w-[2500px] h-[130px] border-1 border-red-500 items-center justify-center flex flex-col gap-3 mt-4">
          <div className="text-center border-1 border-yellow-500 w-[1000px] flex justify-center">
            <p
              className={`text-xl font-semibold truncate w-[1000px] border-1 border-purple-500 ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}
            >
              {currentSong
                ? currentSong.name.replace(/\.mp3$/i, '')
                : 'Sin canción seleccionada'}
            </p>
          </div>
          <div
            className={`border-1 border-red-500 w-[1000px] flex items-center gap-2 text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <span>{formatTime(currentTime)}</span>
            <div
              className={`flex-1 h-2 rounded-full cursor-pointer ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                onSeek(percentage * duration);
              }}
            >
              <div
                className={`h-full rounded-full transition-all ${
                  isDark ? 'bg-blue-500' : 'bg-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-center gap-10 h-[50px] w-[500px] border-1 border-green-500">
            <button
              onClick={toggleShuffle}
              className={`p-1 rounded-full transition-colors ${
                isShuffling
                  ? isDark
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-blue-600 hover:bg-blue-700'
                  : isDark
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Shuffle
                size={20}
                className={
                  isShuffling
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-100'
                    : 'text-gray-800'
                }
              />
            </button>
            <button
              onClick={onPrevious}
              className={`p-1 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <SkipBack size={20} className={isDark ? 'text-gray-100' : 'text-gray-800'} />
            </button>
            <button
              onClick={onPlayPause}
              disabled={!currentSong}
              className={`p-1 text-white rounded-full transition-colors ${
                isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
              } disabled:bg-gray-500 disabled:cursor-not-allowed`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={onNext}
              className={`p-1 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <SkipForward size={20} className={isDark ? 'text-gray-100' : 'text-gray-800'} />
            </button>
            <button
              onClick={toggleShuffle}
              className={`p-1 rounded-full transition-colors ${
                isShuffling
                  ? isDark
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-blue-600 hover:bg-blue-700'
                  : isDark
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Shuffle
                size={20}
                className={
                  isShuffling
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-100'
                    : 'text-gray-800'
                }
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center w-[500px] border-1 border-blue-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {volume === 0 ? (
                <VolumeX size={20} className={isDark ? 'text-gray-100' : 'text-gray-800'} />
              ) : (
                <Volume2 size={20} className={isDark ? 'text-gray-100' : 'text-gray-800'} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className={`w-24 ${isDark ? 'accent-blue-500' : 'accent-blue-600'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

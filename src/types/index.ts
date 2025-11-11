import { RefObject } from 'react';

export interface Song {
  id: string;
  name: string;
  file: File;
  url: string;
  duration: number;
  cover?: string;
  src?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle?: (enabled: boolean) => void;
  isLoop?: boolean;
  onToggleLoop?: (value: boolean) => void;
}

export interface UseAudioElementProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  onNext: () => void;
  onSeek: (time: number) => void;
}

export interface FolderSelectorProps {
  onSongsLoaded: (songs: Song[]) => void;
}

export interface PlaylistPanelProps {
  playlists: Playlist[];
  songs: Song[];
  currentPlaylist: string | null;
  onCreatePlaylist: (name: string) => void;
  onSelectPlaylist: (playlistId: string | null) => void;
  onRenamePlaylist: (playlistId: string, newName: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onRemoveSongFromPlaylist: (playlistId: string, songId: string) => void;
  isDark?: boolean;
}

export interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
  onAddToPlaylist?: (song: Song, playlistId: string) => void;
  showAddButton?: boolean;
  playlists?: Playlist[];
  isDark?: boolean;
}
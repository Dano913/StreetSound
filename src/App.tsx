import { useState, useEffect, useRef, useCallback } from 'react';
import { Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { FolderSelector } from './components/FolderSelector';
import { SongList } from './components/SongList';
import { Player } from './components/Player';
import { PlaylistPanel } from './components/PlaylistPanel';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { Song, Playlist } from './types';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>('music-playlists', []);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const playedSongsRef = useRef<Set<string>>(new Set());
  const currentSongsRef = useRef<Song[]>([]);
  const isShuffleRef = useRef<boolean>(false);
  const playSongRef = useRef<(song: Song) => void>(() => {});

  useEffect(() => {
    currentSongsRef.current = currentPlaylist
      ? songs.filter((song) =>
          playlists.find((p) => p.id === currentPlaylist)?.songIds.includes(song.id)
        )
      : songs;
  }, [songs, playlists, currentPlaylist]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  const handleNext = useCallback(() => {
    const currentSongs = currentSongsRef.current;
    if (!currentSongs.length) return;

    if (isShuffleRef.current) {
      const played = playedSongsRef.current;
      if (played.size >= currentSongs.length) played.clear();
      const remaining = currentSongs.filter((s) => !played.has(s.id));
      if (remaining.length > 0) {
        const randomSong = remaining[Math.floor(Math.random() * remaining.length)];
        played.add(randomSong.id);
        playSongRef.current(randomSong);
      }
      return;
    }

    const currentId = (playSongRef.current as any)?._currentSongId ?? null;
    const idx = currentSongs.findIndex((s) => s.id === currentId);
    if (idx >= 0 && idx < currentSongs.length - 1) {
      playSongRef.current(currentSongs[idx + 1]);
    } else if (idx === -1 && currentSongs.length > 0) {
      playSongRef.current(currentSongs[0]);
    }
  }, []);

  // ✅ USAR isLoop y toggleLoop del hook
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoop,        // ← OBTENER del hook
    playSong,
    togglePlayPause,
    seek,
    changeVolume,
    toggleLoop,    // ← OBTENER del hook
  } = useAudioPlayer(handleNext);

  useEffect(() => {
    playSongRef.current = playSong;
    (playSongRef.current as any)._currentSongId = currentSong?.id ?? null;
  }, [playSong, currentSong]);

  const currentSongs = currentPlaylist
    ? songs.filter((song) =>
        playlists.find((p) => p.id === currentPlaylist)?.songIds.includes(song.id)
      )
    : songs;

  useEffect(() => {
    playedSongsRef.current.clear();
  }, [currentPlaylist, songs.length]);

  const playAndMark = useCallback(
    (song: Song) => {
      if (!song) return;
      playedSongsRef.current.add(song.id);
      playSong(song);
    },
    [playSong]
  );

  const handleSongsLoaded = useCallback(
    (loadedSongs: Song[]) => {
      if (!loadedSongs.length) return;

      const updatedSongs = loadedSongs.map((song: Song) => {
        const file = (song as any).file;
        if (!file) return song;

        const path = file.webkitRelativePath || file.name;
        const parts = path.split('/');
        const folderName = parts[parts.length - 2] || '';

        let cover: string | undefined;
        try {
          const coverPath = `./assets/covers/${folderName}.jpg`;
          console.log('🔍 Buscando carátula en:', coverPath);

          cover = new URL(coverPath, import.meta.url).href;
          console.log('✅ Carátula encontrada:', cover);
        } catch (err) {
          console.warn('❌ No se encontró carátula para', folderName);
          cover = undefined;
        }

        return { ...song, cover };
      });

      setSongs(updatedSongs);
      console.log('🎵 Canciones con carátulas:', updatedSongs);

      if (updatedSongs.length > 0 && !currentSong) {
        playAndMark(updatedSongs[0]);
      }
    },
    [currentSong, playAndMark]
  );

  const handlePrevious = useCallback(() => {
    const currentIndex = currentSongs.findIndex((s) => s.id === currentSong?.id);
    if (currentIndex > 0) {
      playAndMark(currentSongs[currentIndex - 1]);
    }
  }, [currentSongs, currentSong, playAndMark]);

  const handleToggleShuffle = useCallback((enabled: boolean) => {
    setIsShuffle(enabled);
    playedSongsRef.current.clear();
  }, []);

  const handleCreatePlaylist = useCallback(
    (name: string) => {
      const newPlaylist: Playlist = {
        id: `playlist-${Date.now()}`,
        name,
        songIds: [],
        createdAt: Date.now(),
      };
      setPlaylists((prev) => [...prev, newPlaylist]);
    },
    [setPlaylists]
  );

  const handleRenamePlaylist = useCallback(
    (playlistId: string, newName: string) => {
      setPlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, name: newName } : p))
      );
    },
    [setPlaylists]
  );

  const handleDeletePlaylist = useCallback(
    (playlistId: string) => {
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      if (currentPlaylist === playlistId) setCurrentPlaylist(null);
    },
    [setPlaylists, currentPlaylist]
  );

  const handleAddToPlaylist = useCallback(
    (song: Song, playlistId: string) => {
      setPlaylists((prev) =>
        prev.map((p) => {
          if (p.id === playlistId && !p.songIds.includes(song.id)) {
            return { ...p, songIds: [...p.songIds, song.id] };
          }
          return p;
        })
      );
    },
    [setPlaylists]
  );

  const handleRemoveSongFromPlaylist = useCallback(
    (playlistId: string, songId: string) => {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId
            ? { ...p, songIds: p.songIds.filter((id) => id !== songId) }
            : p
        )
      );
    },
    [setPlaylists]
  );

  // ❌ ELIMINAR estas líneas - ya no las necesitas
  // const [isLoop, setIsLoop] = useState(false);
  // const handleToggleLoop = useCallback((enabled: boolean) => {
  //   setIsLoop(enabled);
  // }, []);

  useEffect(() => {
    document.title = currentSong
      ? `${currentSong.name} - Reproductor de Música`
      : 'Reproductor de Música';
  }, [currentSong]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isDark
          ? 'bg-gray-800'
          : 'bg-gray-50'
      }`}
    >
      <header
        className={`shadow-md px-6 py-4 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between border-1 border-red-500">
          <div className="flex gap-5">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-full shadow-md transition-all ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                  : 'bg-white hover:bg-gray-100 text-gray-800'
              }`}
              title={isSidebarOpen ? 'Ocultar playlists' : 'Mostrar playlists'}
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <h1
              className={`text-2xl font-bold ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}
            >
              StreetSound
            </h1>
          </div>
          <div className="flex gap-4">
            <FolderSelector onSongsLoaded={handleSongsLoaded} />
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside
          className={`w-80 p-3 overflow-y-auto h-[680px] border-1 transition-all duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'w-0 p-0 opacity-0'
          } ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          {isSidebarOpen && (
            <PlaylistPanel
              playlists={playlists}
              songs={songs}
              currentPlaylist={currentPlaylist}
              onCreatePlaylist={handleCreatePlaylist}
              onSelectPlaylist={setCurrentPlaylist}
              onRenamePlaylist={handleRenamePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              onRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
              isDark={isDark}
            />
          )}
        </aside>

        <main
          className="flex-1 p-3 overflow-y-auto h-[680px] border-1 border-yellow-500 transition-colors"
          style={{ paddingBottom: '' }}
        >
          <div
            className={`h-[100%] border-1 border-green-500 rounded-xl overflow-hidden shadow-lg p-3 transition-colors ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-xl font-bold ${
                  isDark ? 'text-gray-100' : 'text-gray-800'
                }`}
              >
                {currentPlaylist
                  ? playlists.find((p) => p.id === currentPlaylist)?.name
                  : 'Todas las canciones'}
              </h2>
              <span
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {currentSongs.length}{' '}
                {currentSongs.length === 1 ? 'canción' : 'canciones'}
              </span>
            </div>

            <SongList
              songs={currentSongs}
              currentSong={currentSong}
              onSongSelect={playAndMark}
              onAddToPlaylist={handleAddToPlaylist}
              playlists={playlists}
              showAddButton={true}
              isDark={isDark}
            />
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-1">
        <Player
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          onPlayPause={togglePlayPause}
          onSeek={seek}
          onVolumeChange={changeVolume}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onToggleShuffle={handleToggleShuffle}
          isLoop={isLoop}           // ← Del hook
          onToggleLoop={toggleLoop} // ← Del hook
        />
      </div>
    </div>
  );
}

export default App;
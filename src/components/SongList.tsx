import { Music, Plus } from 'lucide-react';
import { SongListProps } from '../types';


export const SongList = ({
  songs,
  currentSong,
  onSongSelect,
  onAddToPlaylist,
  showAddButton = false,
  playlists = [],
  currentFolder = null,
  isDark = false,
}: SongListProps & { currentFolder?: string | null }) => {
  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const folderGroups = songs.reduce((acc, song) => {
    const folder = song.folder || 'Sin carpeta';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(song);
    return acc;
  }, {} as Record<string, typeof songs>);

  const displayedSongs = currentFolder ? folderGroups[currentFolder] || [] : songs;

  return (
    <div className="space-y-2 border-1 border-red-500 rounded-xl h-[585px] overflow-y-scroll overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {displayedSongs.length === 0 ? (
        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Music size={48} className={`mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'} opacity-50`} />
          <p>No hay canciones cargadas</p>
        </div>
      ) : (
        displayedSongs.map((song) => (
          <div key={song.id}>
            <div
              className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                currentSong?.id === song.id
                  ? isDark
                    ? 'bg-blue-900 border-2 border-blue-400'
                    : 'bg-blue-100 border-2 border-blue-500'
                  : isDark
                  ? 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent'
                  : 'bg-white hover:bg-gray-50 border-2 border-transparent'
              }`}
              onClick={() => onSongSelect(song)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {song.cover ? (
                  <img
                    src={song.cover}
                    alt={song.name}
                    className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <Music size={24} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {song.name.replace(/\.[^/.]+$/, '')}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDuration(song.duration)}
                  </p>
                </div>
              </div>

              {showAddButton && onAddToPlaylist && playlists.length > 0 && (
                <div className="ml-2 relative group">
                  <button
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
                    title="Añadir a lista"
                  >
                    <Plus size={18} className="text-blue-600" />
                  </button>
                  <div
                    className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg hidden group-hover:block z-10 ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    {playlists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToPlaylist(song, playlist.id);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-600 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          isDark ? 'text-gray-100 hover:text-white' : 'text-gray-900'
                        }`}
                      >
                        <div className="text-sm font-medium truncate">{playlist.name}</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {playlist.songIds.length} canciones
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
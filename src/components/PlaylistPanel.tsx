import { useState } from 'react';
import { ListMusic, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Playlist, PlaylistPanelProps } from '../types';

export const PlaylistPanel = ({
  playlists,
  songs,
  currentPlaylist,
  onCreatePlaylist,
  onSelectPlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
  onRemoveSongFromPlaylist,
  isDark = false,
}: PlaylistPanelProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handleRename = (playlistId: string) => {
    if (editingName.trim()) {
      onRenamePlaylist(playlistId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const startEditing = (playlist: Playlist) => {
    setEditingId(playlist.id);
    setEditingName(playlist.name);
  };

  const selectedPlaylist = playlists.find(p => p.id === currentPlaylist);

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4 h-full flex flex-col transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          <ListMusic size={20} />
          Listas de Reproducción
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-blue-100'
          }`}
          title="Nueva lista"
        >
          <Plus size={20} className="text-blue-600" />
        </button>
      </div>

      {showCreateForm && (
        <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50'}`}>
          <input
            type="text"
            placeholder="Nombre de la lista"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            className={`w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400'
                : 'bg-white border-blue-300 text-gray-900'
            }`}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Crear
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewPlaylistName('');
              }}
              className={`flex-1 px-3 py-1 rounded transition-colors ${
                isDark
                  ? 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 space-y-2 overflow-y-auto flex-shrink-0" style={{ maxHeight: '200px' }}>
        <button
          onClick={() => onSelectPlaylist(null)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
            currentPlaylist === null
              ? 'bg-blue-600 text-white'
              : isDark
              ? 'text-gray-100 hover:bg-gray-700'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
        >
          Todas las canciones
        </button>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              currentPlaylist === playlist.id
                ? 'bg-blue-600 text-white'
                : isDark
                ? 'text-gray-100 hover:bg-gray-700'
                : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            {editingId === playlist.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRename(playlist.id)}
                onBlur={() => handleRename(playlist.id)}
                className={`flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-blue-300 text-gray-900'
                }`}
                autoFocus
              />
            ) : (
              <>
                <button
                  onClick={() => onSelectPlaylist(playlist.id)}
                  className="flex-1 text-left truncate"
                >
                  {playlist.name}
                  <span className="text-xs opacity-75 ml-2">
                    ({playlist.songIds.length})
                  </span>
                </button>
                <button
                  onClick={() => startEditing(playlist)}
                  className={`p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-blue-600' : 'hover:bg-blue-500'
                  }`}
                  title="Renombrar"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDeletePlaylist(playlist.id)}
                  className={`p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-red-600' : 'hover:bg-red-500'
                  }`}
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedPlaylist && (
        <div className={`flex-1 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-t pt-4 overflow-y-auto`}>
          <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Canciones en "{selectedPlaylist.name}"
          </h3>
          <div className="space-y-1">
            {selectedPlaylist.songIds.map((songId) => {
              const song = songs.find((s) => s.id === songId);
              if (!song) return null;
              return (
                <div
                  key={songId}
                  className={`flex items-center justify-between p-2 rounded transition-colors ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <span className="text-xs truncate flex-1">{song.name}</span>
                  <button
                    onClick={() => onRemoveSongFromPlaylist(selectedPlaylist.id, songId)}
                    className={`p-1 rounded transition-colors ml-2 ${
                      isDark ? 'hover:bg-red-600' : 'hover:bg-red-100'
                    }`}
                    title="Quitar"
                  >
                    <X size={14} className={isDark ? 'text-red-400' : 'text-red-600'} />
                  </button>
                </div>
              );
            })}
            {selectedPlaylist.songIds.length === 0 && (
              <p className={`text-xs text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Lista vacía. Añade canciones desde la lista principal.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import {
  ListMusic,
  Plus,
  Music2,
  Heart,
  Clock,
  Home,
  User,
  Settings,
} from "lucide-react";
import { PlaylistPanelProps } from "../types";

export const PlaylistPanel = ({
  playlists,
  songs,
  currentPlaylist,
  onCreatePlaylist,
  onSelectPlaylist,
  isDark = false, // usar prop para decidir estilos
}: PlaylistPanelProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setShowCreateForm(false);
    }
  };

  // helpers de clases para no repetir
  const asideCls = `${
    isDark
      ? "bg-gray-900 text-gray-100 rounded-xl"
      : "bg-white text-gray-900"
  } flex flex-col h-[100%] w-full transition-colors duration-150`;

  const headerCls = `flex items-center justify-between p-3`;

  const btnHoverCls = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100";

  const navBtnBase = (active = false) =>
    `flex items-center gap-2 px-2 py-1 rounded transition ${btnHoverCls} text-sm ${
      active ? (isDark ? "font-semibold bg-gray-800" : "font-semibold bg-gray-100") : ""
    }`;

  const playlistBtnCls = (active = false) =>
    `w-full text-left px-2 py-1 rounded truncate transition ${
      active
        ? isDark
          ? "font-semibold bg-gray-800"
          : "font-semibold bg-gray-100"
        : btnHoverCls
    }`;

  const inputCls = `${
    isDark
      ? "bg-gray-800 border-gray-600 text-gray-100"
      : "bg-white border-gray-400 text-gray-900"
  } px-2 py-1 border rounded text-sm focus:outline-none`;

  const actionBtnCls = `text-sm border rounded px-2 py-1 transition ${isDark ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`;

  return (
    <aside className={asideCls}>
      {/* === (1) HEADER === */}
      <div className={headerCls}>
        <div className="flex items-center gap-2">
          <ListMusic size={20} />
          <h2 className="font-semibold text-base">Tu música</h2>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          title="Nueva playlist"
          className={`p-1 rounded ${btnHoverCls}`}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* === (2) NAVEGACIÓN === */}
      <nav className={`flex flex-col gap-1 p-3 border-b ${isDark ? "border-gray-700" : "border-gray-300"} text-sm`}>
        <button onClick={() => onSelectPlaylist(null)} className={navBtnBase(currentPlaylist === null)}>
          <Home size={16} />
          Inicio
        </button>

        <button onClick={() => onSelectPlaylist(null)} className={navBtnBase(false)}>
          <Music2 size={16} />
          Todas las canciones
        </button>

        <button className={navBtnBase(false)}>
          <Heart size={16} />
          Favoritos
        </button>

        <button className={navBtnBase(false)}>
          <Clock size={16} />
          Recientes
        </button>
      </nav>

      {/* === (3) PLAYLISTS === */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <h3 className="text-xs font-semibold uppercase mb-2 opacity-70">Tus playlists</h3>

        {playlists.length === 0 && <p className="text-xs opacity-60 italic">No hay playlists creadas aún.</p>}

        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => onSelectPlaylist(playlist.id)}
            className={playlistBtnCls(currentPlaylist === playlist.id)}
            title={playlist.name}
          >
            <span className="truncate">{playlist.name}</span>
            <span className="opacity-60 text-xs ml-2">({playlist.songIds.length})</span>
          </button>
        ))}

        {showCreateForm && (
          <div className="mt-2 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Nombre de la lista"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className={inputCls}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={handleCreate} className={actionBtnCls}>Crear</button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlaylistName("");
                }}
                className={actionBtnCls}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* === (4) PREVIEW DE PLAYLIST SELECCIONADA === */}
      {currentPlaylist && (
        <div className={`border-t p-3 text-sm ${isDark ? "border-gray-700" : "border-gray-300"}`}>
          <h4 className="font-semibold mb-1">
            {playlists.find((p) => p.id === currentPlaylist)?.name ?? "Playlist"}
          </h4>
          <p className="opacity-70 mb-2">
            {playlists.find((p) => p.id === currentPlaylist)?.songIds.length ?? 0} canciones
          </p>

          <div className="max-h-24 overflow-y-auto space-y-1 text-xs">
            {playlists
              .find((p) => p.id === currentPlaylist)
              ?.songIds.slice(0, 3)
              .map((id) => {
                const song = songs.find((s) => s.id === id);
                if (!song) return null;
                return (
                  <div key={id} className={`${isDark ? "text-gray-200" : "text-gray-800"} truncate`}>
                    {song.name}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* === (5) FOOTER === */}
      <footer className={`border-t p-3 flex items-center justify-between text-sm ${isDark ? "border-gray-700" : "border-gray-300"}`}>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>Invitado</span>
        </div>
        <button title="Configuración" className={`p-1 rounded ${btnHoverCls}`}>
          <Settings size={16} />
        </button>
      </footer>
    </aside>
  );
};

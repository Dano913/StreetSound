import { Music, Plus } from 'lucide-react';
import { SongListProps } from '../types';


export const SongList = ({      // El componente recibe props
  songs,                          // Lista completa de canciones
  currentSong,                    // Canción actualmente seleccionada/reproduciendo
  onSongSelect,                   // Callback al seleccionar canción
  onAddToPlaylist,                // Añadir canción a playlist
  showAddButton = false,          // Booleano para mostrar el botón "+"
  playlists = [],                 // Lista de playlists
  currentFolder = null,           // Carpeta seleccionada
  isDark = false,                 // Booleano para el modo oscuro
}: SongListProps) => {
  const formatDuration = (seconds: number) => {              // Convierte de segundos a minutos:segundos
    if (!seconds || isNaN(seconds)) return '0:00';              // Si esta vacio o no es un número retorna 0:00
    const mins = Math.floor(seconds / 60);                      // Calcula minutos
    const secs = Math.floor(seconds % 60);                      // Calcula segundos restantes
    return `${mins}:${secs.toString().padStart(2, '0')}`;       // Formatea los segundos para que tengan 2 dígitos
  };

  const folderGroups = songs.reduce((acc, song) => {   // Usa reduce que le indica que cada nueva entrada, la clave es la carpeta y valor es un array de canciones dentro de la carpeta
    const folder = song.folder || 'Sin carpeta';       // Si no hay canciones, muestra 'Sin carpeta'
    if (!acc[folder]) acc[folder] = [];                // Crea un array para esa carpeta si aun no existe
    acc[folder].push(song);                            // Añade la canción a la carpeta  
    return acc;                                        // Devuelve el objeto acumulado
  }, {} as Record<string, typeof songs>);              // Indica el tipo de dato delelemento

  const displayedSongs = currentFolder         // currentFolder indica la carpeta seleccionada
    ? folderGroups[currentFolder] || []        // Si hay una carpeta seleccionada muestra sus canciones
    : songs;                                   // Sino muestra todas sin filtrar

  return (
    <div className="
      border-1 border-red-500
      space-y-2 rounded-xl h-[585px] 
      overflow-y-scroll overflow-x-hidden 
      [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
    ">
      {displayedSongs.length === 0 ? (                           // Para el caso de que aun no haya canciones cargadas renderiza un icono por defecto
        <div className={`
          text-center py-8 
          ${isDark ? 'text-gray-400' : 'text-gray-500'}
        `}>
          <Music  
            size={48} 
            className={`
              mx-auto mb-2 opacity-50
              ${isDark ? 'text-gray-600' : 'text-gray-400'}
            `} 
          />
          <p>No hay canciones cargadas</p>
        </div>
      ) : (
        displayedSongs.map((song) => (   // Recorre el array de acanciones
          <div key={song.id}>                          
            <div                         // Cada elemento del array lleva un id  
              className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                  currentSong?.id === song.id     // Detecta la cancion seleccionada para resaltarla
                    ? isDark
                      ? 'bg-blue-900 border-2 border-blue-400'
                      : 'bg-blue-100 border-2 border-blue-500'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent'
                      : 'bg-white hover:bg-gray-50 border-2 border-transparent'
              }`}
              onClick={() => onSongSelect(song)}  // Detecta el click sobre esa cancion para darle los estilos
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">    
                {song.cover ? (
                                                      // Estructura de la tarjeta de la cancion
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
                          {playlist.songIds.length}
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
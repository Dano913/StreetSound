import { useState, useEffect } from "react";
import { Song } from "../types";

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);

  // Cargar metadatos desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("musicMetadata");
    if (saved) {
      setSongs(JSON.parse(saved));
    }
  }, []);

  const handleSongsLoaded = (loadedSongs: Song[]) => {
    setSongs(loadedSongs);

    // Guardar solo metadatos en localStorage
    const metadata = loadedSongs.map((s) => ({
      id: s.id,
      name: s.name,
      folder: s.folder,
      cover: s.cover,
      duration: s.duration,
      url: s.url,
    }));
    localStorage.setItem("musicMetadata", JSON.stringify(metadata));
  };

  return { songs, handleSongsLoaded, setSongs };
}

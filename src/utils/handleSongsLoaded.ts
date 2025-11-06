// src/utils/handleSongsLoaded.ts
import { Song } from "../types";

const covers = import.meta.glob("/src/assets/covers/*.jpg", { eager: true, import: "default" });

export function handleSongsLoaded(
  loadedSongs: Song[],
  setSongs: (songs: Song[]) => void,
  playAndMark: (song: Song) => void,
  currentSong?: Song | null
) {
  if (!loadedSongs.length) return;

  const updatedSongs = loadedSongs.map((song: Song) => {
    const file = (song as any).file;
    if (!file) return song;

    const path = file.webkitRelativePath || file.name;
    const parts = path.split("/");
    const folderName = parts[parts.length - 2] || "";

    // Buscar la carátula importada previamente por nombre
    const possibleCoverPath = `/src/assets/covers/${folderName}.jpg`;
    const cover = (covers as Record<string, string>)[possibleCoverPath];

    return { ...song, cover };
  });

  setSongs(updatedSongs);

  if (updatedSongs.length > 0 && !currentSong) {
    playAndMark(updatedSongs[0]);
  }
}

import { FolderOpen } from 'lucide-react';
import { FolderSelectorProps, Song } from '../types';

export const FolderSelector = ({ onSongsLoaded }: FolderSelectorProps) => {
  const handleFolderSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const audioFiles: Song[] = [];
    const supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];

    const firstFile = files[0];
    const folderName = firstFile.webkitRelativePath
      ? firstFile.webkitRelativePath.split('/')[0]
      : 'Desconocido';

    const coverPath = `/src/assets/covers/${folderName}.jpg`;

    console.log('📁 Carpeta detectada:', folderName);
    console.log('🖼️ Ruta esperada de carátula:', coverPath);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isAudio = supportedFormats.some(format =>
        file.name.toLowerCase().endsWith(format)
      );

      if (isAudio) {
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);

        const pathParts = file.webkitRelativePath.split('/');
        const folderName = pathParts.length > 2 
          ? pathParts[pathParts.length - 2]  // Carpeta inmediata
          : pathParts[0];   

        await new Promise<void>((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            audioFiles.push({
              id: `${file.name}-${file.lastModified}`,
              name: file.name,
              file,
              url,
              duration: audio.duration,
              cover: coverPath,
              folder: folderName
            });
            resolve();
          });
          audio.addEventListener('error', () => resolve());
        });
      }
    }

    onSongsLoaded(audioFiles);
  };

  return (
    <div className="">
      <label className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
        <FolderOpen size={20} />
        <input
          type="file"
          className="hidden"
          onChange={handleFolderSelect}
          // @ts-ignore
          webkitdirectory="true"
          multiple
          accept="audio/*"
        />
      </label>
    </div>
  );
};

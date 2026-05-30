import {useState} from 'react';
import {FolderPickerProps} from "@/components/FolderPicker.tsx";
import {GettingStarted} from "@/pages/GettingStarted.tsx";
import {Image} from "../../shared/types/image.ts";
import {Editor} from "@/pages/Editor.tsx";

export function Home() {
  const [selectedFolderPath, setSelectedFolderPath] = useState<string | null>(null);
  const [includeSubfolders, setIncludeSubfolders] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(false);

  const [imageFiles, setImageFiles] = useState<Image[]>([]);

  const folderPickerProps: FolderPickerProps = {
    selectedFolder: selectedFolderPath,
    onFolderSelect: setSelectedFolderPath,
    includeSubfolders: includeSubfolders,
    onIncludeSubfoldersChange: setIncludeSubfolders,
  };

  const handleStartClick = async () => {
    if (!selectedFolderPath) {
      console.warn('No folder selected');
      return;
    }

    setIsLoading(true);
    try {
      const result = await window.electron?.folder?.readImageFiles?.(selectedFolderPath, includeSubfolders);
      if (result?.success) {
        console.log(`Found ${result.data.count} image files:`, result.data.images);
        setImageFiles(result.data.images)
      } else {
        console.error('Failed to read image files:', result?.error);
      }
    } catch (error) {
      console.error('Error reading image files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoading && imageFiles.length === 0) {
    return <GettingStarted folderPickerProps={folderPickerProps} onStartClick={handleStartClick}/>;
  }

  return <Editor isLoading={isLoading} images={imageFiles} />
}

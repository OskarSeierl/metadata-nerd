import {useState} from 'react';
import {FolderPickerProps} from "@/components/FolderPicker.tsx";
import {GettingStarted} from "@/pages/GettingStarted.tsx";

export function Home() {
  const [selectedFolderPath, setSelectedFolderPath] = useState<string | null>(null);
  const [includeSubfolders, setIncludeSubfolders] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(false);

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
        console.log(`Found ${result.count} image files:`, result.files);
        // TODO: Process or navigate with the found image files
      } else {
        console.error('Failed to read image files:', result?.error);
      }
    } catch (error) {
      console.error('Error reading image files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return <GettingStarted folderPickerProps={folderPickerProps} onStartClick={handleStartClick} />;
}

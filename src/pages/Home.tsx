import {useEffect, useState} from 'react';
import {FolderPickerProps} from "@/components/FolderPicker.tsx";
import {GettingStarted} from "@/pages/GettingStarted.tsx";
import {Image} from "../../shared/types/image.ts";
import {Editor} from "@/pages/Editor.tsx";
import {ProgressUpdate} from "../../shared/types/electron-api.ts";
import {ScanLoading} from "@/pages/ScanLoading.tsx";
import {parseResponse} from "@/lib/response-parser.ts";

export function Home() {
  const [selectedFolderPath, setSelectedFolderPath] = useState<string | null>(null);
  const [includeSubfolders, setIncludeSubfolders] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState<ProgressUpdate | null>(null);

  const [imageFiles, setImageFiles] = useState<Image[]>([]);

  useEffect(() => {
    window.electron.file.onScanProgress((data) => {
      setScanProgress(data);
    });
  }, []);

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
    const result = await parseResponse(window.electron.file.readImageFiles(selectedFolderPath, includeSubfolders));
    if (result) {
      setImageFiles(result.images);
    }
    setIsLoading(false);
  };

  if (!isLoading && imageFiles.length === 0) {
    return <GettingStarted folderPickerProps={folderPickerProps} onStartClick={handleStartClick}/>;
  }

  if(isLoading && scanProgress) {
    return <ScanLoading progress={scanProgress} />
  }

  return <Editor images={imageFiles} />
}

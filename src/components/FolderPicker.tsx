import {useState} from 'react';
import {Button} from '@/components/ui/button.tsx';
import {Switch} from '@/components/ui/switch.tsx';
import {Spinner} from '@/components/ui/spinner.tsx';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert.tsx';
import {FolderOpenIcon, CheckListIcon, AlertCircleIcon} from '@hugeicons/core-free-icons';
import {HugeiconsIcon} from '@hugeicons/react';
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item.tsx";
import {parseResponse} from "@/lib/response-parser.ts";

export interface FolderPickerProps {
  selectedFolder: string | null;
  includeSubfolders: boolean;
  onFolderSelect: (path: string) => void;
  onIncludeSubfoldersChange: (include: boolean) => void;
}

export function FolderPicker({selectedFolder, includeSubfolders, onFolderSelect, onIncludeSubfoldersChange}: FolderPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectFolder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const folderPath = await parseResponse(window.electron.file.selectFolder());
      if (folderPath) {
        onFolderSelect(folderPath);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to select folder';
      setError(errorMessage);
      console.error('Failed to select folder:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={handleSelectFolder}
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? (
          <>
            <Spinner className="size-4"/>
            Selecting...
          </>
        ) : (
          <>
            <HugeiconsIcon icon={FolderOpenIcon}/>
            Select Folder
          </>
        )}
      </Button>

      {selectedFolder && (
        <>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={CheckListIcon}/>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Folder Selected</ItemTitle>
              <ItemDescription>
                <span className="break-all font-mono font-medium">{selectedFolder}</span>
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={FolderOpenIcon}/>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Include subfolders</ItemTitle>
              <ItemDescription>{includeSubfolders ? 'Scanning subdirectories' : 'Only this folder'}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch
                checked={includeSubfolders}
                onCheckedChange={onIncludeSubfoldersChange}
                aria-label="Include subfolders"
              />
            </ItemActions>
          </Item>
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <HugeiconsIcon icon={AlertCircleIcon}/>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}


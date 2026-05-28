import {useState} from 'react';
import {Button} from '@/components/ui/button.tsx';
import {Switch} from '@/components/ui/switch.tsx';
import {Spinner} from '@/components/ui/spinner.tsx';
import {Card, CardContent, CardDescription, CardTitle} from '@/components/ui/card.tsx';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert.tsx';
import {FolderOpenIcon, CheckListIcon, AlertCircleIcon} from '@hugeicons/core-free-icons';
import {HugeiconsIcon} from '@hugeicons/react';

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
      const folderPath = await window.electron?.folder?.selectFolder?.();
      if (folderPath) {
        onFolderSelect?.(folderPath);
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
          <Alert>
            <HugeiconsIcon icon={CheckListIcon}/>
            <AlertTitle>Folder Selected</AlertTitle>
            <AlertDescription>
              <span className="break-all font-mono font-medium">{selectedFolder}</span>
            </AlertDescription>
          </Alert>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="text-left">
                  <CardTitle>Include subfolders</CardTitle>
                  <CardDescription>
                    {includeSubfolders ? 'Scanning subdirectories' : 'Only this folder'}
                  </CardDescription>
                </div>
                <Switch
                  checked={includeSubfolders}
                  onCheckedChange={onIncludeSubfoldersChange}
                  aria-label="Include subfolders"
                />
              </div>
            </CardContent>
          </Card>
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


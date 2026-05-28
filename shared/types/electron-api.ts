export interface ElectronAPI {
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
  };
  folder: {
    selectFolder: () => Promise<string | null>;
    readImageFiles: (folderPath: string, includeSubfolders: boolean) => Promise<{
      success: boolean;
      files: string[];
      count: number;
      error?: string;
    }>;
  };
}

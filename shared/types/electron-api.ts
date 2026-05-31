import {Image} from "./image.ts";

export interface ElectronAPI {
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
  };
  folder: {
    selectFolder: () => Promise<string | null>;
    readImageFiles: (folderPath: string, includeSubfolders: boolean) => Promise<ResponseData<ReadImageFilesResult>>;
    onScanProgress: (callback: (data: ProgressUpdate) => void) => () => void;
    onThumbnailReady: (callback: (id: string) => void) => () => void;
  };
}

export interface ProgressUpdate {
  current: number;
  total: number;
}

export interface ResponseData<T> {
  success: boolean;
  error?: string;
  data: T
}

export interface ReadImageFilesResult {
  count: number;
  images: Image[];
}

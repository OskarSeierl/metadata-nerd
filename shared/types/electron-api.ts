import {Image} from "./image.ts";

export interface ElectronAPI {
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
  };
  file: {
    selectFolder: () => Promise<ApiResponse<string>>;
    readImageFiles: (folderPath: string, includeSubfolders: boolean) => Promise<ApiResponse<Image[]>>;
    onScanProgress: (callback: (data: ProgressUpdate) => void) => () => void;
    onThumbnailReady: (callback: (id: number) => void) => () => void;
  },
  editor: {
    renameImages: (pattern: string, images: Image[]) => Promise<ApiResponse<Image[]>>;
  },
  settings: {
    deleteCache: () => Promise<ApiResponse<void>>;
  }
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  message: string;
}

export interface ProgressUpdate {
  current: number;
  total: number;
}

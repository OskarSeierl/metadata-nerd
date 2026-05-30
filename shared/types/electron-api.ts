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
  };
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

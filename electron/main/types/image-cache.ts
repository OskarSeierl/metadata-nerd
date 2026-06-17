import {Image, ImageMetadata} from "../../../shared/types/image.ts";

export interface ImageCacheRow {
  id: string;
  file_path: string;
  filename: string;
  metadata: string | null;
  cached_at: number;
  file_mtime: number;
}

// The contract for the rest of your app to use
export interface ImageCacheService {
  initialize(): void;
  clearAllData(): void;
  getCachedImage(filePath: string, currentMtime: number): Image | null;
  saveCachedImage(
    filePath: string,
    filename: string,
    metadata: ImageMetadata,
    mtime: number
  ): number;
  updateCachedImage(
    id: number,
    filePath: string,
    filename: string,
    metadata: ImageMetadata | null,
    mtime: number
  ): void;
  deleteCachedImage(filePath: string): void;
  close(): void;
}

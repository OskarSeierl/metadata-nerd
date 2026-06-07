import path from 'node:path';
import {promises as fs} from 'fs';
import exifr from 'exifr';
import {ALLOWED_IMAGE_EXTENSIONS} from '../../../shared/constants/allowed-image-extensions.ts';
import {Image, ImageMetadata} from '../../../shared/types/image.ts';
import {sqlLiteImageCache} from "../constants/cache.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toImageMetadata = (exifData: any): ImageMetadata | null => {
  if (!exifData) {
    return null;
  }

  return {
    ...exifData, // Include all other EXIF fields as well
    dateTimeOriginal: exifData.DateTimeOriginal,
    gpsLatitude: exifData.latitude,
    gpsLongitude: exifData.longitude,
  };
}

export const readImageFilesRecursive = async (
  dir: string,
  recursive: boolean,
  onProgress?: (current: number, total: number) => void
): Promise<Image[]> => {
  const imagePaths: string[] = [];

  async function walk(currentPath: string) {
    try {
      const entries = await fs.readdir(currentPath, {withFileTypes: true});

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          if (recursive) {
            await walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
            imagePaths.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentPath}:`, error);
    }
  }

  await walk(dir);

  let currentProgress = 0;
  onProgress?.(currentProgress, imagePaths.length);

  const CHUNK_SIZE = 50;
  const results: Image[] = [];

  for (let i = 0; i < imagePaths.length; i += CHUNK_SIZE) {
    const chunk = imagePaths.slice(i, i + CHUNK_SIZE);

    const chunkPromises = chunk.map(async (filePath) => {
      try {
        const stats = await fs.stat(filePath);
        const mtime = Math.floor(stats.mtimeMs / 1000);

        const cached = sqlLiteImageCache.getCachedImage(filePath, mtime);
        if (cached) {
          return {...cached, fromCache: true} as Image;
        }

        const exifData = await exifr.parse(filePath, {
          exif: true,
          makerNote: false,
          gps: true,
        }).catch(() => null);

        const metadata = toImageMetadata(exifData);

        const id = sqlLiteImageCache.saveCachedImage(filePath, path.basename(filePath), metadata, mtime);

        return {
          id,
          fullPath: filePath,
          filename: path.basename(filePath),
          metadata,
          fileModificationTime: mtime,
          cachedAt: Math.floor(Date.now() / 1000),
          fromCache: false,
        } as Image;
      } catch {
        return {
          id: 0,
          fullPath: filePath,
          filename: path.basename(filePath),
          metadata: null,
          fileModificationTime: 0,
          cachedAt: Math.floor(Date.now() / 1000),
          fromCache: false,
        } as Image;
      } finally {
        currentProgress++;
        onProgress?.(currentProgress, imagePaths.length);
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);

    await new Promise(resolve => setTimeout(resolve, 1));
  }

  return results;
};

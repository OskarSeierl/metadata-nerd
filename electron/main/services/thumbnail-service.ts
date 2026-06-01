import { app, protocol } from 'electron';
import path from 'node:path';
import { promises as fs } from 'fs';
import exifr from 'exifr';
import sharp from 'sharp';
import { Image } from '../../../shared/types/image.ts';

protocol.registerSchemesAsPrivileged([
  { scheme: 'thumb', privileges: { bypassCSP: true, standard: true, secure: true, supportFetchAPI: true } },
]);

export const getThumbnailsDir = (): string => {
  return path.join(app.getPath('userData'), 'thumbnails');
};

export const getThumbnailPathFromID = (thumbId: string): string => {
  return getThumbnailPathFromFilename(`${thumbId}.jpg`);
};

export const getThumbnailPathFromFilename = (filename: string): string => {
  return path.join(getThumbnailsDir(), filename);
};

export async function initializeThumbnailDir(): Promise<void> {
  const dir = getThumbnailsDir();

  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function generateAndStoreThumbnail(
  filePath: string,
  thumbId: string
): Promise<boolean> {
  try {
    const thumbPath = getThumbnailPathFromID(thumbId);

    try {
      await fs.access(thumbPath);
      console.log(`Thumbnail already exists: ${thumbPath}`);
      return true;
    } catch {
      // File doesn't exist, proceed with generation
    }

    let thumbData = await exifr.thumbnail(filePath).catch(() => null);

    if (!thumbData) {
      try {
        thumbData = await sharp(filePath)
          .resize({
            width: 300,
            height: 300,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 80 })
          .toBuffer();

        console.log(`Generated fallback thumbnail for: ${path.basename(filePath)}`);
      } catch (sharpError) {
        console.warn(`Could not generate thumbnail for ${filePath}`, sharpError);
        return false;
      }
    }

    if (thumbData) {
      await fs.writeFile(getThumbnailPathFromID(thumbId), thumbData).catch((err) => {
        console.warn(`Failed to write thumbnail for ${filePath}`, err);
      });
      return true;
    }
  } catch (error) {
    console.error(`Error generating thumbnail for ${filePath}:`, error);
  }

  return false;
}

export const processThumbnailsInBackground = async (images: Image[], sender: Electron.WebContents) => {
  for (const img of images) {
    try {
      const success = await generateAndStoreThumbnail(img.fullPath, img.id);
      if (success) {
        sender.send('thumbnail-ready', img.id);
      }
    } catch (error) {
      console.error(`Failed background thumbnail for ${img.id}`, error);
    }
  }
};



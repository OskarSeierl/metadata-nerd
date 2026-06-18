import {app, protocol} from 'electron';
import path from 'node:path';
import {promises as fs} from 'fs';
import sharp from 'sharp';
import {Image} from '../../../shared/types/image.ts';
import {exiftool} from "../constants/exif-tool.ts";

protocol.registerSchemesAsPrivileged([
  {scheme: 'thumb', privileges: {bypassCSP: true, standard: true, secure: true, supportFetchAPI: true}},
]);

export const clearThumbnails = async (): Promise<void> => {
  const dir = getThumbnailsDir();

  await fs.access(dir);
  const files = await fs.readdir(dir);
  await Promise.all(files.map(file => fs.unlink(path.join(dir, file))));
}

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
    await fs.mkdir(dir, {recursive: true});
  }
}

const thumbnailExists = async (thumbId: string): Promise<boolean> => {
  try {
    await fs.access(getThumbnailPathFromID(thumbId));
    return true;
  } catch {
    return false;
  }
};

const generateAndStoreThumbnail = async (filePath: string, thumbId: string): Promise<boolean> => {
  const thumbPath = getThumbnailPathFromID(thumbId);

  try {
    await exiftool.extractThumbnail(filePath, thumbPath);
  } catch {
    console.warn(`EXIF thumbnail extraction failed for ${filePath}`);
    try {
      const thumbData = await sharp(filePath, {failOn: "none"})
        .resize({
          width: 256,
          height: 256,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({quality: 80})
        .toBuffer();

      console.log(`Generated fallback thumbnail for: ${path.basename(filePath)}`);

      if (thumbData) {
        await fs.writeFile(getThumbnailPathFromID(thumbId), thumbData).catch((err) => {
          console.warn(`Failed to write thumbnail for ${filePath}`, err);
        });
        return true;
      }
    } catch (sharpError) {
      console.warn(`Could not generate thumbnail for ${filePath}`, sharpError);
      return false;
    }
  }
  return false;
};

export const generateAndStoreMissingThumbnail = async (
  filePath: string,
  thumbId: string
): Promise<boolean> => {
  if (await thumbnailExists(thumbId)) {
    return true;
  }
  return await generateAndStoreThumbnail(filePath, thumbId);
};

export const processThumbnailsInBackground = async (images: Image[], sender: Electron.WebContents) => {
  for (const img of images) {
    try {
      const success = await generateAndStoreMissingThumbnail(img.fullPath, img.id.toString());
      if (success) {
        sender.send('thumbnail-ready', img.id);
      }
    } catch (error) {
      console.error(`Failed background thumbnail for ${img.id}`, error);
    }
  }
};



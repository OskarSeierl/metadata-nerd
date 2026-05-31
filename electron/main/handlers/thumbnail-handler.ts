import {app, protocol} from "electron";
import path from "node:path";
import {promises as fs} from "fs";
import exifr from "exifr";
import sharp from "sharp";
import {Image} from "../../../shared/types/image.ts";

protocol.registerSchemesAsPrivileged([
  {scheme: 'thumb', privileges: {bypassCSP: true, standard: true, secure: true, supportFetchAPI: true}}
]);

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
}

export const registerThumbnailHandler = () => {
  protocol.handle('thumb', async (request) => {
    const fileName = request.url.slice('thumb://'.length);

    const thumbPath = geThumbnailPathFromFilename(fileName);

    try {
      const buffer = await fs.readFile(thumbPath);
      return new Response(buffer, {
        headers: {'Content-Type': 'image/jpeg'}
      });
    } catch (error) {
      console.error('Error serving thumbnail:', error);
      return new Response('Not Found', {status: 404});
    }
  });
}

export function getThumbnailsDir(): string {
  return path.join(app.getPath('userData'), 'thumbnails');
}

export function getThumbnailPathFromID(thumbId: string): string {
  return geThumbnailPathFromFilename(`${thumbId}.jpg`);
}

const geThumbnailPathFromFilename = (filename: string) => {
  return path.join(getThumbnailsDir(), filename);
}

/**
 * Generate and store a thumbnail for an image file.
 * First attempts to extract embedded thumbnail, falls back to generating one with sharp.
 * Returns the thumbId if successful, null otherwise.
 */
export const generateAndStoreThumbnail = async (
  filePath: string,
  thumbId: string
): Promise<boolean> => {
  try {
    // Check if thumbnail already exists
    const thumbPath = getThumbnailPathFromID(thumbId);
    try {
      await fs.access(thumbPath);
      console.log(`Thumbnail already exists: ${thumbPath}`);
      return true;
    } catch {
      // File doesn't exist, proceed with generation
    }

    // Try to extract embedded thumbnail first
    let thumbData = await exifr.thumbnail(filePath).catch(() => null);

    // If no embedded thumbnail, generate one using sharp
    if (!thumbData) {
      try {
        thumbData = await sharp(filePath)
          .resize({
            width: 300,
            height: 300,
            fit: 'inside', // Keeps aspect ratio
            withoutEnlargement: true,
          })
          .jpeg({quality: 80}) // Force lightweight JPEG
          .toBuffer();

        console.log(`Generated fallback thumbnail for: ${path.basename(filePath)}`);
      } catch (sharpError) {
        console.warn(`Could not generate thumbnail for ${filePath}`, sharpError);
        return false;
      }
    }

    // Write thumbnail to disk
    if (thumbData) {
      const thumbPath = getThumbnailPathFromID(thumbId);
      await fs.writeFile(thumbPath, thumbData).catch((err) => {
        console.warn(`Failed to write thumbnail for ${filePath}`, err);
      });
      return true;
    }
  } catch (error) {
    console.error(`Error generating thumbnail for ${filePath}:`, error);
  }

  return false;
}

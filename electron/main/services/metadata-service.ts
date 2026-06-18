import {Image, ImageMetadata} from "../../../shared/types/image.ts";
import {DEFAULT_WRITE_ARGS, exiftool} from "../constants/exif-tool.ts";
import {sqlLiteImageCache} from "../constants/cache.ts";
import {promises as fs} from "fs";
import path from "node:path";
import {mkdir} from "node:fs/promises";

export const updateMetadataOfImages = async (metadata: ImageMetadata, images: Image[], keepOriginal: boolean): Promise<Image[]> => {
  const CHUNK_SIZE = 5;
  const updatedImages: Image[] = [];

  for (let i = 0; i < images.length; i += CHUNK_SIZE) {
    const chunk = images.slice(i, i + CHUNK_SIZE);

    const chunkPromises = chunk.map(async (image) => {
      try {
        const writeArgs = DEFAULT_WRITE_ARGS;
        if(keepOriginal) {
          const backupDir = path.join(path.dirname(image.fullPath), ".edited");
          await mkdir(backupDir, {recursive: true});
          const backupPath = path.join(backupDir, path.basename(image.fullPath));
          writeArgs.push('-o', backupPath);
        } else {
          writeArgs.push('-overwrite_original');
        }

        console.log(metadata)

        await exiftool.write(image.fullPath, metadata, {
          writeArgs: writeArgs,
        });

        const newImage = {
          ...image,
          metadata: {...image.metadata, ...metadata},
        };

        const stats = await fs.stat(newImage.fullPath);
        const newMtime = Math.floor(stats.mtimeMs / 1000);

        sqlLiteImageCache.updateCachedImage(newImage.id, newImage.fullPath, newImage.filename, newImage.metadata, newMtime);

        return newImage;
      } catch (error) {
        console.error(`Failed to write to ${image.fullPath}:`, error);
        return image;
      }
    });

    const results = await Promise.all(chunkPromises);
    updatedImages.push(...results);
  }

  return updatedImages;
};

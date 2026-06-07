import {RenamePlan} from "../types/rename.ts";
import {Image} from "../../../shared/types/image.ts";
import {sqlLiteImageCache} from "../constants/cache.ts";
import crypto from 'node:crypto';
import path from 'node:path';
import {promises as fs} from 'fs';
import {replacePlaceholdersInPattern, sanitizeForFilename} from "../../../shared/utils/file.ts";

const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const generateRenamePlans = async (pattern: string, images: Image[]): Promise<RenamePlan[]> => {
  const claimedPaths = new Set<string>();
  const originalPathsLower = new Set(images.map(img => img.fullPath.toLowerCase()));
  const plans: RenamePlan[] = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    let baseFilename = replacePlaceholdersInPattern(pattern, i, image);
    baseFilename = sanitizeForFilename(baseFilename);

    const directory = path.dirname(image.fullPath);
    const extension = path.extname(image.fullPath);

    const isPathSafe = async (testPath: string): Promise<boolean> => {
      const lowerPath = testPath.toLowerCase();

      if (claimedPaths.has(lowerPath)) return false;

      try {
        await fs.access(testPath);
        // If it exists, it's only safe if it's the original file we are currently evaluating
        return originalPathsLower.has(lowerPath);
      } catch {
        // File doesn't exist on disk, it's safe!
        return true;
      }
    };

    // 2. The streamlined loop
    let finalPath = '';
    let finalFilename = '';
    let counter = 0;

    // Generate the initial guess outside the loop
    let suffix = '';
    let testFilename = `${baseFilename}${extension}`;
    let testPath = path.join(directory, testFilename);

    // Keep incrementing and regenerating until the helper says it's safe
    while (!(await isPathSafe(testPath))) {
      counter++;
      suffix = `_${counter}`;
      testFilename = `${baseFilename}${suffix}${extension}`;
      testPath = path.join(directory, testFilename);
    }

    claimedPaths.add(testPath.toLowerCase());
    finalPath = testPath;
    finalFilename = testFilename;

    const needsRename = image.fullPath !== finalPath;
    const tempFullPath = needsRename
      ? path.join(directory, `.__temp_${crypto.randomUUID()}${extension}`)
      : image.fullPath;

    plans.push({image, tempFullPath, newFullPath: finalPath, newFilename: finalFilename, needsRename});
  }

  return plans;
};

const evacuateToTempFiles = async (plans: RenamePlan[]): Promise<Set<number>> => {
  const successfullyTemped = new Set<number>();
  const chunks = chunkArray(plans, 100);

  for (const chunk of chunks) {
    await Promise.all(chunk.map(async (plan) => {
      if (!plan.needsRename) return;

      try {
        await fs.rename(plan.image.fullPath, plan.tempFullPath);
        successfullyTemped.add(plan.image.id);
      } catch (error) {
        console.error(`Failed to evacuate ${plan.image.filename} to temp file`, error);
      }
    }));
  }

  return successfullyTemped;
};

const finalizeRenamesAndCache = async (
  plans: RenamePlan[],
  successfullyTemped: Set<number>
): Promise<Image[]> => {
  const updatedImages: Image[] = [];
  const chunks = chunkArray(plans, 100);

  for (const chunk of chunks) {
    await Promise.all(chunk.map(async (plan) => {
      if (!plan.needsRename) {
        updatedImages.push(plan.image);
        return;
      }

      if (!successfullyTemped.has(plan.image.id)) return;

      try {
        await fs.rename(plan.tempFullPath, plan.newFullPath);

        const stats = await fs.stat(plan.newFullPath);
        const newMtime = Math.floor(stats.mtimeMs / 1000);

        try {
          sqlLiteImageCache.updateCachedImage(plan.image.id, plan.newFullPath, plan.newFilename, plan.image.metadata, newMtime);
        } catch (e) {
          console.warn(`Failed to update cache for ${plan.newFilename}.`, e);
        }

        plan.image.filename = plan.newFilename;
        plan.image.fullPath = plan.newFullPath;

        updatedImages.push(plan.image);
      } catch (error) {
        console.error(`Failed final rename for ${plan.newFilename}`, error);
        // Rollback
        try {
          await fs.rename(plan.tempFullPath, plan.image.fullPath);
        } catch (e) {
          console.error(`Failed to rollback temp file for ${plan.image.filename}`, e);
        }
      }
    }));
  }

  return updatedImages;
};

export const renameImages = async (pattern: string, images: Image[]): Promise<Image[]> => {
  // 1. Calculate mathematically safe names for everything
  const plans = await generateRenamePlans(pattern, images);

  // 2. Move all changing files to temporary random names (Chunks of 100)
  const successfullyTemped = await evacuateToTempFiles(plans);

  // 3. Move from temp to final names, update SQLite, and format return data (Chunks of 100)
  return await finalizeRenamesAndCache(plans, successfullyTemped);
};

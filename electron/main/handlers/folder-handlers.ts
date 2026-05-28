import {BrowserWindow, dialog, ipcMain} from 'electron';
import {promises as fs} from 'fs';
import path from 'node:path';
import {ALLOWED_IMAGE_EXTENSIONS} from "../../../shared/constants/allowed-image-extensions.ts";
import {ImageWithMetadata} from "shared/types/image.ts";
import exifr from 'exifr'

export async function readImageFilesRecursive(dir: string, recursive: boolean): Promise<ImageWithMetadata[]> {
  const imagePaths: string[] = [];

  // 1. FAST PHASE: Just find all the valid file paths first
  async function walk(currentPath: string) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

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

  // 2. HEAVY PHASE: Read metadata for all found images concurrently
  return await Promise.all(
    imagePaths.map(async (filePath) => {
      try {
        // exifr is very fast because it only reads the header bytes of the file, not the whole image
        const meta = await exifr.parse(filePath, {
          exif: true,
          makerNote: false,
          gps: true
        });

        return {
          fullPath: filePath,
          filename: path.basename(filePath),
          metadata: meta || null, // Fallback if image has no EXIF data
        };
      } catch (error) {
        console.warn(`Could not read metadata for ${filePath}`, error);
        return {
          fullPath: filePath,
          filename: path.basename(filePath),
          metadata: null, // Return null if the file is corrupt or unreadable
        };
      }
    })
  );
}

export function registerFolderHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  ipcMain.handle('read-image-files', async (_event, folderPath: string, includeSubfolders: boolean) => {
    if (!folderPath) {
      throw new Error('Folder path is required');
    }

    try {
      const imageFiles = await readImageFilesRecursive(folderPath, includeSubfolders);
      return {
        success: true,
        files: imageFiles,
        count: imageFiles.length,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        files: [],
        count: 0,
      };
    }
  });
}


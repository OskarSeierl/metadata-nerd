import { BrowserWindow, dialog, ipcMain } from 'electron';
import {ReadImageFilesResult, ResponseData} from "../../../shared/types/electron-api.ts";
import { readImageFilesRecursive } from '../services/image-service.ts';
import { processThumbnailsInBackground } from '../services/thumbnail-service.ts';

export function registerImageHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  ipcMain.handle('read-image-files', async (event, folderPath: string, includeSubfolders: boolean): Promise<ResponseData<ReadImageFilesResult>> => {
    try {
      if (!folderPath) {
        return {
          success: false,
          error: 'Folder path is required',
          data: {
            count: 0,
            images: [],
          }
        };
      }

      const imageFiles = await readImageFilesRecursive(
        folderPath,
        includeSubfolders,
        (current, total) => {
          event.sender.send('read-image-files-progress', {current, total})
        }
      );

      processThumbnailsInBackground(imageFiles, event.sender);

      return {
        success: true,
        data: {
          count: imageFiles.length,
          images: imageFiles,
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        data: {
          count: 0,
          images: [],
        }
      };
    }
  });
}

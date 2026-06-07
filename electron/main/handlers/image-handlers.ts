import {BrowserWindow, dialog, ipcMain} from 'electron';
import {ApiResponse, ReadImageFilesResult} from "../../../shared/types/electron-api.ts";
import {readImageFilesRecursive} from '../services/image-service.ts';
import {processThumbnailsInBackground} from '../services/thumbnail-service.ts';
import {Image} from "../../../shared/types/image.ts";
import {renameImages} from "../services/rename-service.ts";

export function registerImageHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('select-folder', async (): Promise<ApiResponse<string>> => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return {success: false, message: 'No folder selected'};
    }

    return {success: true, message: 'Folder selected successfully', data: result.filePaths[0]};
  });

  ipcMain.handle('read-image-files', async (event, folderPath: string, includeSubfolders: boolean): Promise<ApiResponse<ReadImageFilesResult>> => {
    if (!folderPath) {
      return {success: false, message: 'Folder path is required'};
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
      message: `Found ${imageFiles.length} image files`,
      data: {
        count: imageFiles.length,
        images: imageFiles,
      }
    };
  });

  ipcMain.handle('rename-images', async (_event, pattern: string, images: Image[]): Promise<ApiResponse<void>> => {
    try {
      await renameImages(pattern, images);
      return {
        success: true,
        message: `Renamed ${images.length} images successfully`,
      };
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: 'Failed to rename images',
      };
    }
  });
}

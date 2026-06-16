import {BrowserWindow, dialog, ipcMain} from 'electron';
import {ApiResponse} from "../../../shared/types/electron-api.ts";
import {readImageFilesRecursive} from '../services/image-service.ts';
import {processThumbnailsInBackground} from '../services/thumbnail-service.ts';
import {Image, ImageMetadata} from "../../../shared/types/image.ts";
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

  ipcMain.handle('read-image-files', async (event, folderPath: string, includeSubfolders: boolean): Promise<ApiResponse<Image[]>> => {
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
      data: imageFiles
    };
  });

  ipcMain.handle('rename-images', async (_event, pattern: string, images: Image[]): Promise<ApiResponse<Image[]>> => {
    try {
      const renamedImages = await renameImages(pattern, images);
      return {
        success: true,
        message: `Renamed ${images.length} images successfully`,
        data: renamedImages
      };
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: 'Failed to rename images',
      };
    }
  });

  ipcMain.handle('edit-metadata', async (_event, metadata: ImageMetadata, images: Image[]): Promise<ApiResponse<Image[]>> => {
    try {
      console.log(metadata);
      // TODO: Implement the logic to edit metadata for the images
      return {
        success: true,
        message: `Edited ${images.length} images successfully`,
        data: [] // TODO
      };
    } catch (e) {
      console.log(e)
      return {
        success: false,
        message: 'Failed to edit metadata',
      };
    }
  })
}

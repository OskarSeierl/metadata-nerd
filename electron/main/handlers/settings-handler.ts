import {ipcMain} from "electron";
import {clearThumbnails} from "../services/thumbnail-service.ts";
import {ApiResponse} from "../../../shared/types/electron-api.ts";
import {sqlLiteImageCache} from "../constants/cache.ts";

export const registerSettingsHandlers = () => {
  ipcMain.handle('delete-cache', async (): Promise<ApiResponse> => {
    try {
      sqlLiteImageCache.clearAllData();
      await clearThumbnails();
      return { success: true, message: 'Cache cleared successfully' };
    } catch (error) {
      console.error('Error clearing cache:', error);
      return { success: false, message: 'Error clearing cache' };
    }
  });
};

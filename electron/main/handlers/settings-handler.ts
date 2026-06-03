import {ipcMain} from "electron";
import {clearAllData} from "../services/database-service.ts";
import {clearThumbnails} from "../services/thumbnail-service.ts";
import {ApiResponse} from "../../../shared/types/electron-api.ts";

export const registerSettingsHandlers = () => {
  ipcMain.handle('delete-cache', async (): Promise<ApiResponse> => {
    try {
      clearAllData();
      await clearThumbnails();
      return { success: true, message: 'Cache cleared successfully' };
    } catch (error) {
      console.error('Error clearing cache:', error);
      return { success: false, message: 'Error clearing cache' };
    }
  });
};

import { ipcRenderer } from 'electron';
import {ApiResponse} from "../../shared/types/electron-api.ts";

export const deleteCache = async (): Promise<ApiResponse> => {
  return ipcRenderer.invoke('delete-cache');
};

import { ipcRenderer, IpcRendererEvent } from 'electron';
import {ApiResponse, ProgressUpdate} from "../../shared/types/electron-api.ts";
import {Image} from "../../shared/types/image.ts";

export const selectFolder = async (): Promise<ApiResponse<string>> => {
  return ipcRenderer.invoke('select-folder');
};

export const readImageFiles = async (folderPath: string, includeSubfolders: boolean) => {
  return ipcRenderer.invoke('read-image-files', folderPath, includeSubfolders);
};

export const onScanProgress = (callback: (data: ProgressUpdate) => void) => {
  const listener = (_event: IpcRendererEvent, data: ProgressUpdate) => {
    callback(data);
  };
  ipcRenderer.on('read-image-files-progress', listener);
  return () => ipcRenderer.removeListener('read-image-files-progress', listener);
};

export const onThumbnailReady = (callback: (id: string) => void) => {
  const listener = (_event: IpcRendererEvent, id: string) => callback(id);
  ipcRenderer.on('thumbnail-ready', listener);
  return () => ipcRenderer.removeListener('thumbnail-ready', listener);
};

export const renameImages = async (pattern: string, images: Image[]): Promise<ApiResponse<Image[]>> => {
  return ipcRenderer.invoke('rename-images', pattern, images);
};

import { ipcRenderer } from 'electron';

export const selectFolder = async (): Promise<string | null> => {
  return ipcRenderer.invoke('select-folder');
};

export const readImageFiles = async (folderPath: string, includeSubfolders: boolean) => {
  return ipcRenderer.invoke('read-image-files', folderPath, includeSubfolders);
};

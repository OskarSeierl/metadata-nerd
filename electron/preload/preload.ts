import { contextBridge } from 'electron';
import {ElectronAPI} from "../../shared/types/electron-api.ts";
import {closeWindow, maximizeWindow, minimizeWindow} from "./window.ts";
import {selectFolder, readImageFiles, onScanProgress, onThumbnailReady} from "./image.ts";
import {deleteCache} from "./settings.ts";

const api: ElectronAPI = {
  window: {
    minimize: minimizeWindow,
    maximize: maximizeWindow,
    close: closeWindow,
  },
  file: {
    selectFolder,
    readImageFiles,
    onScanProgress,
    onThumbnailReady,
  },
  settings: {
    deleteCache
  }
};

contextBridge.exposeInMainWorld('electron', api);

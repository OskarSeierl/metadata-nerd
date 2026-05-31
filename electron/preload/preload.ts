import { contextBridge } from 'electron';
import {ElectronAPI} from "../../shared/types/electron-api.ts";
import {closeWindow, maximizeWindow, minimizeWindow} from "./window.ts";
import {selectFolder, readImageFiles, onScanProgress, onThumbnailReady} from "./folder.ts";

const api: ElectronAPI = {
  window: {
    minimize: minimizeWindow,
    maximize: maximizeWindow,
    close: closeWindow,
  },
  folder: {
    selectFolder,
    readImageFiles,
    onScanProgress,
    onThumbnailReady,
  }
};

contextBridge.exposeInMainWorld('electron', api);

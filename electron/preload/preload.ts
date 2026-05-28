import { contextBridge } from 'electron';
import {ElectronAPI} from "../../types/electron-api.ts";
import {closeWindow, maximizeWindow, minimizeWindow} from "./window.ts";

const api: ElectronAPI = {
  window: {
    minimize: minimizeWindow,
    maximize: maximizeWindow,
    close: closeWindow,
  }
};

contextBridge.exposeInMainWorld('electron', api);

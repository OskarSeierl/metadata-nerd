/// <reference types="vite/client" />

import {ElectronAPI} from "../shared/types/electron-api.ts";

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

window.electron = window.electron || {};

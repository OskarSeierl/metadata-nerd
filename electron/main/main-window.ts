import { BrowserWindow } from 'electron';
import path from 'node:path';
import {registerWindowHandlers} from "./handlers/window-handlers.ts";
import {currentDir, RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC} from "./constants.ts";

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    icon: path.join(VITE_PUBLIC, 'electron-vite.svg'),
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(currentDir, 'preload.mjs'),
    },
  });

  // Handler binden
  registerWindowHandlers(win);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  return win;
}

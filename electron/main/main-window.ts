import { BrowserWindow } from 'electron';
import path from 'node:path';
import {registerWindowHandlers} from "./handlers/window-handlers.ts";
import {currentDir, RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC} from "./constants.ts";
import {registerFolderHandlers} from "./handlers/folder-handlers.ts";

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    icon: path.join(VITE_PUBLIC, 'electron-vite.svg'),
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(currentDir, 'preload.mjs'),
    },
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
  });

  // Handler binden
  registerWindowHandlers(win);
  registerFolderHandlers(win);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  return win;
}

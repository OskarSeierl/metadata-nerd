import { BrowserWindow } from 'electron';
import path from 'node:path';
import {registerWindowHandlers} from "./handlers/window-handlers.ts";
import {currentDir, RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC} from "./constants/constants.ts";
import {registerImageHandlers} from "./handlers/image-handlers.ts";
import {registerThumbnailHandler} from "./handlers/thumbnail-handler.ts";
import {registerSettingsHandlers} from "./handlers/settings-handler.ts";

export const createMainWindow = (): BrowserWindow => {
  const win = new BrowserWindow({
    icon: path.join(VITE_PUBLIC, 'favicon.png'),
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(currentDir, 'preload.mjs'),
    },
    width: 1400,
    height: 1000,
    minWidth: 1024,
    minHeight: 768,
  });

  // Handlers register
  registerWindowHandlers(win);
  registerImageHandlers(win);
  registerThumbnailHandler();
  registerSettingsHandlers();

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  return win;
};

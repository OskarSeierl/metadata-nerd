import { ipcMain, BrowserWindow, app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
function registerWindowHandlers(mainWindow) {
  ipcMain.handle("window-minimize", () => {
    if (!mainWindow.isDestroyed()) mainWindow.minimize();
  });
  ipcMain.handle("window-maximize", () => {
    if (!mainWindow.isDestroyed()) {
      if (mainWindow.isMaximized()) mainWindow.unmaximize();
      else mainWindow.maximize();
    }
  });
  ipcMain.handle("window-close", () => {
    if (!mainWindow.isDestroyed()) mainWindow.close();
  });
}
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.join(currentDir, "..");
path.join(APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(APP_ROOT, "public") : RENDERER_DIST;
function createMainWindow() {
  const win = new BrowserWindow({
    icon: path.join(VITE_PUBLIC, "electron-vite.svg"),
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(currentDir, "preload.mjs")
    }
  });
  registerWindowHandlers(win);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  return win;
}
app.whenReady().then(() => {
  createMainWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

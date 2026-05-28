import { ipcMain, BrowserWindow } from 'electron';

export function registerWindowHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('window-minimize', () => {
    if (!mainWindow.isDestroyed()) mainWindow.minimize();
  });

  ipcMain.handle('window-maximize', () => {
    if (!mainWindow.isDestroyed()) {
      if (mainWindow.isMaximized()) mainWindow.unmaximize();
      else mainWindow.maximize();
    }
  });

  ipcMain.handle('window-close', () => {
    if (!mainWindow.isDestroyed()) mainWindow.close();
  });
}

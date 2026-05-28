import { app, BrowserWindow } from 'electron';
import {createMainWindow} from "./main-window.ts";

// Globale Referenz, um Garbage Collection zu verhindern
// @ts-ignore
let mainWindow: BrowserWindow | null = null;

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  mainWindow = createMainWindow();
});

// Mac behavior: App continues to run even when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mainWindow = null;
  }
});

// Mac behavior: Recreate windows when the Dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
  }
});

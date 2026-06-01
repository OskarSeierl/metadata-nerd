import { app, BrowserWindow } from 'electron';
import {createMainWindow} from "./main-window.ts";
import {initializeDatabase, closeDatabase} from './services/database-service.ts';
import {initializeThumbnailDir} from "./services/thumbnail-service.ts";

// Globale Referenz, um Garbage Collection zu verhindern
// @ts-ignore
let mainWindow: BrowserWindow | null = null;

app.disableHardwareAcceleration();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection in main process:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception in main process:', error);
});

app.whenReady()
  .then(async () => {
    initializeDatabase();
    await initializeThumbnailDir();
    mainWindow = createMainWindow();
  })
  .catch((error) => {
    console.error('Failed to initialize app:', error);
  });

// Mac behavior: App continues to run even when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    closeDatabase();
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

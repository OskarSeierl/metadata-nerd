"use strict";
const electron = require("electron");
const minimizeWindow = () => {
  electron.ipcRenderer.invoke("window-minimize");
};
const maximizeWindow = () => {
  electron.ipcRenderer.invoke("window-maximize");
};
const closeWindow = () => {
  electron.ipcRenderer.invoke("window-close");
};
const api = {
  window: {
    minimize: minimizeWindow,
    maximize: maximizeWindow,
    close: closeWindow
  }
};
electron.contextBridge.exposeInMainWorld("electron", api);

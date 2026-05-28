import {ipcRenderer} from 'electron';

export const minimizeWindow = () => {
  ipcRenderer.invoke('window-minimize');
};

export const maximizeWindow = () => {
  ipcRenderer.invoke('window-maximize');
};

export const closeWindow = () => {
  ipcRenderer.invoke('window-close');
};

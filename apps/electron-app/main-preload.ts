import { contextBridge, ipcRenderer } from 'electron';
import { ContextBridgeApi } from '@context-bridge/index';

const exposedApi: ContextBridgeApi = {
  closeWindow: () => ipcRenderer.send('quit'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  restoreDownWindow: () => ipcRenderer.invoke('restore-down-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),

  maximizeWindowEvent: (fnc: () => void) => {
    ipcRenderer.on('maximize-window-event', () => fnc());
  },
  unmaximizeWindowEvent: (fnc: () => void) => {
    ipcRenderer.on('unmaximize-window-event', () => fnc());
  },
};

console.log('electronApi is being exposed in the renderer process');

contextBridge.exposeInMainWorld('electronApi', exposedApi);

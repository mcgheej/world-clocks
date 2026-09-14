import { app, ipcMain } from 'electron';
import { App } from './app';

export class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

ipcMain.handle('minimize-window', () => {
  App.mainWindow?.minimize();
});

ipcMain.handle('restore-down-window', () => {
  App.mainWindow?.unmaximize();
});

ipcMain.handle('maximize-window', () => {
  App.mainWindow?.maximize();
});

// Handle App termination
ipcMain.on('quit', (event: Electron.IpcMainEvent, code: number) => {
  app.exit(code);
});

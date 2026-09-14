import { BrowserWindow } from 'electron';
import { join, resolve } from 'path';
import * as fs from 'fs';
import { WindowStateKeeper } from './window-state-keeper';

export class App {
  static mainWindow: BrowserWindow | null = null;
  static application: Electron.App | null = null;
  static BrowserWindow: typeof BrowserWindow;
  static serve: boolean = false;
  static stateKeeper: WindowStateKeeper;

  static main(
    app: Electron.App,
    browserWindow: typeof BrowserWindow,
    serve: boolean,
    stateKeeper: WindowStateKeeper,
  ): void {
    App.BrowserWindow = browserWindow;
    App.application = app;
    App.serve = serve;
    App.stateKeeper = stateKeeper;

    App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on('ready', App.onReady); // Create the main window when the app is ready
    App.application.on('activate', App.onActivate);
  }

  private static onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      App.application?.quit();
    }
  }

  private static onActivate(): void {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.mainWindow === null) {
      App.onReady();
    }
  }

  private static onReady(): void {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    App.initMainWindow();
    App.loadMainWindow();
  }

  private static initMainWindow(): void {
    // Create the browser window.
    App.mainWindow = new BrowserWindow(App.getBrowserWindowOptions());
    App.mainWindow.removeMenu();

    App.mainWindow.on('maximize', () => {
      App.mainWindow?.webContents.send('maximize-window-event');
    });

    App.mainWindow.on('unmaximize', () => {
      App.mainWindow?.webContents.send('unmaximize-window-event');
    });

    if (App.stateKeeper.isMaximised) {
      App.mainWindow?.maximize();
    }
    App.stateKeeper.track(App.mainWindow);

    App.mainWindow.once('ready-to-show', () => {
      if (App.mainWindow?.isMaximized()) {
        App.mainWindow?.webContents.send('maximize-window-event');
      }
      App.mainWindow?.show();
    });

    App.mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      App.mainWindow = null;
    });
  }

  private static loadMainWindow(): void {
    if (App.serve) {
      import('electron-debug').then((debug) => {
        debug.default({ isEnabled: true, showDevTools: true });
      });

      import('electron-reloader').then((reloader) => {
        const reloaderFn = (reloader as any).default || reloader;
        reloaderFn(module);
      });
      App.mainWindow?.loadURL('http://localhost:4200');
    } else {
      // Path when running electron executable
      let pathIndex = '../../../../../dist/browser/index.html';

      if (fs.existsSync(join(__dirname, '../../../../dist/browser/index.html'))) {
        // Path when running electron in local folder - relative to location of app.js file
        pathIndex = '../../../../dist/browser/index.html';
      }

      const fullPath = join(__dirname, pathIndex);
      const url = `file://${resolve(fullPath).replace(/\\/g, '/')}`;
      App.mainWindow?.loadURL(url);
    }
  }

  private static getBrowserWindowOptions(): Electron.BrowserWindowConstructorOptions {
    const preloadPath = join(__dirname, 'main-preload.js');
    return {
      x: App.stateKeeper.x,
      y: App.stateKeeper.y,
      width: App.stateKeeper.width,
      height: App.stateKeeper.height,
      frame: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: App.serve,
        contextIsolation: true,
        webSecurity: !App.serve,
        backgroundThrottling: false,
        preload: preloadPath,
      },
    };
  }
}

import { app, BrowserWindow } from 'electron';
import { App } from './app';
import { windowStateKeeper, WindowStateKeeper } from './window-state-keeper';
import { ElectronEvents } from './electron-events';

class Main {
  static bootstrap(stateKeeper: WindowStateKeeper): void {
    const args = process.argv.slice(1);
    const serve = args.some((val) => val === '--serve');

    App.main(app, BrowserWindow, serve, stateKeeper);
  }

  static bootstrapElectronEvents(): void {
    ElectronEvents.bootstrapElectronEvents();
  }
}

const appWindowStateKeeper = windowStateKeeper();
Main.bootstrap(appWindowStateKeeper);
Main.bootstrapElectronEvents();

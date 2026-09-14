import settings from 'electron-settings';

export type WindowStateKeeper = {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximised: boolean;
  track: (win: Electron.BrowserWindow) => void;
};

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
}

const windowStateDefault = {
  x: 0,
  y: 0,
  width: 1000,
  height: 800,
  isMaximized: false,
};

export function windowStateKeeper(): WindowStateKeeper {
  let window: Electron.BrowserWindow | null;
  let windowState: WindowState = windowStateDefault;

  function setBounds() {
    // Restore from appConfig
    if (settings.hasSync('windowState')) {
      windowState = settings.getSync('windowState') as unknown as WindowState;
      return;
    }
    // Default
    windowState = {
      x: 0,
      y: 0,
      width: 1000,
      height: 800,
      isMaximized: false,
    };
  }

  function saveState() {
    if (window) {
      if (!windowState.isMaximized && !window.isMaximized()) {
        const winRect = window.getBounds();
        windowState.x = winRect.x;
        windowState.y = winRect.y;
        windowState.width = winRect.width;
        windowState.height = winRect.height;
      }
      windowState.isMaximized = window.isMaximized();
      settings.setSync('windowState', {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        isMaximized: windowState.isMaximized,
      });
    }
  }

  function track(win: Electron.BrowserWindow) {
    window = win;
    // ['resize', 'move', 'close'].forEach((event) => {
    //   win.on(event, saveState);
    // });
    win.on('resize', saveState);
    win.on('move', saveState);
    win.on('close', saveState);
  }

  setBounds();

  return {
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    isMaximised: windowState.isMaximized,
    track,
  };
}

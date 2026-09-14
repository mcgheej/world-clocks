export type ContextBridgeApi = {
  // Renderer ==> Main
  closeWindow: () => void;
  minimizeWindow: () => Promise<void>;
  restoreDownWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;

  // Main ==> Renderer
  maximizeWindowEvent: (fnc: () => void) => void;
  unmaximizeWindowEvent: (fnc: () => void) => void;
};

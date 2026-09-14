import { Service, signal } from '@angular/core';
import { ContextBridgeApi } from '@context-bridge/index';

@Service()
export class ElectronApiService {
  readonly electronApi = signal<ContextBridgeApi | null>(window.electronApi ?? null);
  readonly windowMaximized = signal<boolean>(false);

  constructor() {
    window.electronApi?.maximizeWindowEvent(() => {
      this.windowMaximized.set(true);
    });

    window.electronApi?.unmaximizeWindowEvent(() => {
      this.windowMaximized.set(false);
    });
  }
}

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

declare global {
  interface Window {
    electronApi: import('@context-bridge/index').ContextBridgeApi;
  }
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

import { PlatformRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

/**
 * Platform for dynamically loading an Angular application in a web browser
 */
const platformRef: PlatformRef = platformBrowserDynamic();
platformRef.bootstrapModule(AppModule)
  .catch(err => console.error(err));

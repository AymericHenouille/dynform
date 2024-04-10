import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

const MODULES: (Type<unknown> | ModuleWithProviders<unknown>)[] = [
  BrowserModule
];

@NgModule({
  imports: [MODULES],
  exports: [MODULES],
})
export class CoreModule { }

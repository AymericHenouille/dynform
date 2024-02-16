import { NgModule, Type } from '@angular/core';

/**
 * Public Declarations
 *
 * This is a list of all the components, directives and pipes that are part of the public API of this module.
 *
 * @type {Type<unknown>[]}
 */
const PUBLIC_DECLARATIONS: Type<unknown>[] = [

];

/**
 * The DynFormModule is the main module of the DynForm library.
 *
 * It provides all the components, directives and pipes that are part of the public API of this module.
 */
@NgModule({
  declarations: [PUBLIC_DECLARATIONS],
  exports: [PUBLIC_DECLARATIONS],
})
export class DynFormModule { }

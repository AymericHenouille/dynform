import { NgModule, Type } from '@angular/core';
import { DynformGroupNameDirective } from './directives/dynform-group-name.directive';
import { DynformGroupDirective } from './directives/dynform-group.directive';
import { DynformNameDirective } from './directives/dynform-name.directive';
import { DynFormContainerComponent, DynformDirective } from './directives/dynform.directive';

/**
 * Public Declarations
 *
 * This is a list of all the components, directives and pipes that are part of the public API of this module.
 *
 * @type {Type<unknown>[]}
 */
const PUBLIC_DECLARATIONS: Type<unknown>[] = [
  DynformDirective,
  DynformNameDirective,
  DynformGroupDirective,
  DynformGroupNameDirective,
];

/**
 * The DynFormModule is the main module of the DynForm library.
 *
 * It provides all the components, directives and pipes that are part of the public API of this module.
 */
@NgModule({
  declarations: [PUBLIC_DECLARATIONS, DynFormContainerComponent],
  exports: [PUBLIC_DECLARATIONS],
})
export class DynFormModule { }

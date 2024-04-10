import { Directive, forwardRef } from '@angular/core';
import { DYNFORM_PARENT_CONTEXT } from './dynform-parent-context.token';

/**
 * Directive to mark a form element as a dynform.
 */
@Directive({
  selector: '[dynformName]',
  providers: [
    {
      provide: DYNFORM_PARENT_CONTEXT,
      useExisting: forwardRef(() => DynformNameDirective),
    },
  ],
})
export class DynformNameDirective<TValue, TData> {

}

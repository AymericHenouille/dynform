import { Directive, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { DynContext } from '../models/dyncontext.model';
import { DYNFORM_PARENT_CONTEXT } from './dynform-parent-context.token';

@Directive({
  selector: '[dynFormGroup]',
  providers: [
    {
      provide: DYNFORM_PARENT_CONTEXT,
      useExisting: forwardRef(() => DynformGroupDirective),
    }
  ]
})
export class DynformGroupDirective<TValue, TData> implements DynContext<TValue, TData>, OnInit, OnDestroy {
  name!: string | number | Symbol;
  dynForm: any;
  parent?: DynContext<any, any> | undefined;


  public ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}

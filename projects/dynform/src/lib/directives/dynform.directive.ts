import { Directive, Inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FieldDynForm } from '../forms/dynforms/field.dynform';
import { DynContext } from '../models/dyncontext.model';
import { DYNFORM_PARENT_CONTEXT } from './dynform-parent-context.token';

/**
 * Directive to mark a form element as a dynform.
 */
@Directive({
  selector: '[dynform]',
})
export class DynformDirective<TValue, TData> implements OnInit, OnDestroy {
  /**
   * The dynform.
   */
  @Input()
  public dynForm!: FieldDynForm<TValue, TData>;

  /**
   * Create a new instance of DynformDirective.
   * @param parentContext The parent context of the dynform.
   */
  public constructor(
    @Optional() @Inject(DYNFORM_PARENT_CONTEXT)
    private readonly parentContext: DynContext<TValue, TData>
  ) { }

  public ngOnInit(): void {

  }

  public ngOnDestroy(): void {

  }
}

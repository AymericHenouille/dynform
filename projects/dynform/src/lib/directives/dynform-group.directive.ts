import { Directive, Inject, Input, OnInit, Optional, SkipSelf, forwardRef } from '@angular/core';
import { GroupDynForm } from '../forms/dynforms/group.dynform';
import { DynContext } from '../models/dyncontext.model';
import { DYNFORM_CONTEXT, readContextName } from './dynform-parent-context.token';

/**
 * Directive to mark a form element as a dynform.
 */
@Directive({
  selector: '[dynFormGroup]',
  providers: [
    {
      provide: DYNFORM_CONTEXT,
      useExisting: forwardRef(() => DynformGroupDirective),
    }
  ]
})
export class DynformGroupDirective<TValue, TData> implements DynContext<TValue, TData>, OnInit {
  /**
   * The dynform.
   *
   * @type {GroupDynForm<TValue, TData>}
   * @memberof DynformGroupDirective
   */
  @Input('dynFormGroup')
  public dynForm!: GroupDynForm<TValue, TData>;
  /**
   * The name of the dynform.
   *
   * @type {(string | number | Symbol)}
   * @memberof DynformGroupDirective
   */
  @Input('dynFormGroupName')
  public name!: string | number | Symbol;

  /**
   * Create a new instance of DynformDirective.
   * @param parent The parent context of the dynform.
   */
  public constructor(
    @Optional() @SkipSelf() @Inject(DYNFORM_CONTEXT)
    public readonly parent: DynContext<TValue, TData>,
  ) { }

  /**
   * Initialize the directive.
   */
  public ngOnInit(): void {
    this.name = readContextName(this);
  }
}

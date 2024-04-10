import { Directive, Inject, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { FieldDynForm } from '../forms/dynforms/field.dynform';
import { DynContext } from '../models/dyncontext.model';
import { DYNFORM_CONTEXT, readContextFormByName } from './dynform-parent-context.token';

@Directive({
  selector: '[dynformGroupName]'
})
export class DynformGroupNameDirective<TValue, TData> implements DynContext<TValue, TData>, OnInit {
  /**
   * The name of the dynform.
   *
   * @type {(string | number | Symbol)}
   * @memberof DynformNameDirective
   */
  @Input('dynformName')
  public name!: string | number | Symbol;

  /**
   * The dynform.
   * @type {FieldDynForm<TValue, TData>}
   * @memberof DynformNameDirective
   */
  public dynForm!: FieldDynForm<TValue, TData>;

  /**
   * Create a new instance of DynformNameDirective.
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
    this.dynForm = readContextFormByName<TValue, TData>(this, this.name);
  }
}

import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, Self, SkipSelf, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Behavior } from '../forms/behavior/behavior.model';
import { InputBehavior } from '../forms/behavior/input.behavior';
import { VisibleBehavior } from '../forms/behavior/visible.behavior';
import { FieldDynForm } from '../forms/dynforms/field.dynform';
import { DynContext } from '../models/dyncontext.model';
import { DYNFORM_CONTEXT, readContextName } from './dynform-parent-context.token';

/**
 * Directive to mark a form element as a dynform.
 */
@Directive({
  selector: '[dynForm]',
  providers: [
    {
      provide: DYNFORM_CONTEXT,
      useExisting: forwardRef(() => DynformDirective),
    },
  ],
})
export class DynformDirective<TValue, TData> implements DynContext<TValue, TData>, OnInit, OnDestroy {
  /**
   * The dynform.
   * @type {FieldDynForm<TValue, TData>}
   * @memberof DynformDirective
   */
  @Input()
  public dynForm!: FieldDynForm<TValue, TData>;
  /**
   * The name of the dynform.
   *
   * @type {string}
   * @memberof DynformDirective
   */
  @Input('dynFormName')
  public name!: string | number | Symbol;

  /**
   * The parent context of the dynform.
   *
   * @private
   * @type {Behavior<FieldDynForm<TValue, TData>>[]}
   * @memberof DynformDirective
   */
  private readonly BEHAVIOR: Behavior<FieldDynForm<TValue, TData>>[] = [
    new VisibleBehavior(this.elementRef),
    new InputBehavior(this.elementRef, this.accessor),
  ];

  /**
   * Create a new instance of DynformDirective.
   * @param parent The parent context of the dynform.
   * @param accessor The accessor reference of the dynform.
   * @param elementRef The element reference of the dynform.
   */
  public constructor(
    @Optional() @SkipSelf() @Inject(DYNFORM_CONTEXT)
    public  readonly parent: DynContext<TValue, TData>,
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR)
    private readonly accessor: ControlValueAccessor | ControlValueAccessor[],
    private readonly elementRef: ElementRef<HTMLElement>,
  ) { }

  /**
   * Set the context of the dynform and bind all behavior.
   */
  public ngOnInit(): void {
    this.name = readContextName(this);
    this.BEHAVIOR.forEach((behavior) => behavior.bind(this.dynForm));
    setTimeout(() => this.dynForm.setContext(this));
  }

  /**
   * Dispose the directive.
   */
  public ngOnDestroy(): void {
    this.BEHAVIOR.forEach((behavior) => behavior.dispose());
  }
}

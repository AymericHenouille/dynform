import { Directive, Inject, Input, OnDestroy, OnInit, Optional, SkipSelf, TemplateRef, ViewContainerRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { VisibleBehavior } from '../forms/behavior/visible.behavior';
import { EditableDynForm } from '../forms/dynforms/editable.dynform';
import { GroupDynForm } from '../forms/dynforms/group.dynform';
import { DynContext } from '../models/dyncontext.model';
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
export class DynformNameDirective<TValue, TData> implements DynContext<TValue, TData>, OnInit, OnDestroy {
  /**
   * The name of the dynform.
   *
   * @type {(string | number | Symbol)}
   * @memberof DynformNameDirective
   */
  @Input('dynformName')
  public name!: string | number | symbol;

 /**
   * The visible behavior of the dynform.
   *
   * @private
   * @type {VisibleBehavior<TValue, TData>}
   * @memberof DynformDirective
   */
  private _visibleBehavior: VisibleBehavior<TValue, TData> = new VisibleBehavior(this.templateRef, this.viewContainerRef);

  /**
   * Create a new instance of DynformNameDirective.
   * @param parent The parent context of the dynform.
   * @param templateRef The template reference of the dynform.
   * @param viewContainerRef The view container reference of the dynform.
   */
  public constructor(
    @Inject(forwardRef(() => NG_VALUE_ACCESSOR))
    private readonly controlValueAccessor: ControlValueAccessor,
    @Optional() @SkipSelf() @Inject(DYNFORM_PARENT_CONTEXT)
    public  readonly parent: DynContext<any, any> | undefined,
    private readonly templateRef: TemplateRef<TData>,
    private readonly viewContainerRef: ViewContainerRef,
  ) { }

  /**
   * Set the context of the dynform and bind all behavior.
   */
  public ngOnInit(): void {
    const { dynForm } = this;
    if (dynForm !== undefined) {
      const form: EditableDynForm<TValue, TData> = dynForm as EditableDynForm<TValue, TData>;
      form.setContext(this);
      this._visibleBehavior.bind(form);
    }
  }

  /**
   * Dispose the behavior of the dynform.
   */
  public ngOnDestroy(): void {
    this._visibleBehavior.dispose();
  }

  /**
   * Get the dynform from the parent context.
   *
   * @readonly
   * @type {(EditableDynForm<TValue, TData> | undefined)}
   * @memberof DynformNameDirective
   */
  public get dynForm(): EditableDynForm<TValue, TData> | undefined {
    if (this.parent) {
      const { dynForm } = this.parent;
      if (dynForm instanceof GroupDynForm) {
        return dynForm.get(this.name);
      }
    }
    return undefined;
  }
}

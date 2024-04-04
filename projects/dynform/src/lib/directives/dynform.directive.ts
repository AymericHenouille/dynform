import { AfterViewInit, Component, ComponentRef, ContentChildren, Directive, Inject, Input, OnDestroy, OnInit, Optional, QueryList, SkipSelf, TemplateRef, ViewChild, ViewContainerRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Behavior } from '../forms/behavior/behavior.model';
import { VisibleBehavior } from '../forms/behavior/visible.behavior';
import { FieldDynForm } from '../forms/dynforms/field.dynform';
import { DynContext } from '../models/dyncontext.model';
import { DYNFORM_PARENT_CONTEXT } from './dynform-parent-context.token';

/**
 * Directive to mark a form element as a dynform.
 */
@Directive({
  selector: '[dynForm]',
  providers: [
    {
      provide: DYNFORM_PARENT_CONTEXT,
      useExisting: forwardRef(() => DynformDirective),
    },
  ],
})
export class DynformDirective<TValue, TData> implements DynContext<TValue, TData>, OnInit, OnDestroy {
  /**
   * The default name of the dynform.
   *
   * @private
   * @static
   * @type {string}
   * @memberof DynformDirective
   */
  private static readonly DEFAULT_NAME: string = 'root';
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
  public name!: string;

  /**
   * Create a new instance of DynformDirective.
   * @param parentContext The parent context of the dynform.
   * @param templateRef The template reference of the dynform.
   * @param viewContainerRef The view container reference of the dynform.
   */
  public constructor(
    @Optional() @SkipSelf() @Inject(DYNFORM_PARENT_CONTEXT)
    public  readonly parent: DynContext<TValue, TData>,
    private readonly templateRef: TemplateRef<TData>,
    private readonly viewContainerRef: ViewContainerRef,
  ) { }

  /**
   * Set the context of the dynform and bind all behavior.
   */
  public ngOnInit(): void {
    const component: ComponentRef<DynFormContainerComponent<TValue, TData>> = this.viewContainerRef.createComponent<DynFormContainerComponent<TValue, TData>>(DynFormContainerComponent);
    component.setInput('templateRef', this.templateRef);
    component.setInput('dynForm', this.dynForm);
    component.setInput('dynFormName', this.name ?? DynformDirective.DEFAULT_NAME);
  }

  /**
   * Dispose the directive.
   */
  public ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}

@Component({
  selector: 'dyn-form-container',
  template: '<ng-container #container></ng-container>',
})
export class DynFormContainerComponent<TValue, TData> implements AfterViewInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef })
  public viewContainerRef!: ViewContainerRef;
  @ContentChildren(NG_VALUE_ACCESSOR, { descendants: true, read: QueryList })
  public set accessor(acc: QueryList<ControlValueAccessor>)
  {
    console.log('accessor', acc)
    acc.changes.subscribe((value) => console.log(value))
  }

  @Input()
  public templateRef!: TemplateRef<TData>;
  @Input()
  public dynForm!: FieldDynForm<TValue, TData>;
  @Input()
  public dynFormName!: string;

  private behaviors!: Behavior<FieldDynForm<TValue, TData>>[];

  public ngAfterViewInit(): void {
    this.behaviors = [
      new VisibleBehavior(this.templateRef, this.viewContainerRef),
      // new InputBehavior(this.accessor),
    ];

    this.behaviors.forEach(behavior => behavior.bind(this.dynForm));
  }

  public ngOnDestroy(): void {
    this.behaviors.forEach(behavior => behavior.dispose());
  }
}

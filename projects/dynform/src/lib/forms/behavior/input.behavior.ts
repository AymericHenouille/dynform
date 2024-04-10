import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription, map } from 'rxjs';
import { InputAccessor } from '../../accessor/input.accessor';
import { DynFormValue } from '../../models/value.model';
import { EditableDynForm } from '../dynforms/editable.dynform';
import { Behavior } from './behavior.model';

/**
 * Input behavior
 * This behavior is used to update the value of the dynform.
 */
export class InputBehavior<TValue, TData> implements Behavior<EditableDynForm<TValue, TData>> {
  /**
   * The subscription to the value observable.
   *
   * @private
   * @type {Subscription}
   * @memberof InputBehavior
   */
  private _valueSubscription!: Subscription;
  /**
   * The subscription to the disabled observable.
   *
   * @private
   * @type {Subscription}
   * @memberof InputBehavior
   */
  private _disabledSubscription!: Subscription;

  /**
   * Creates a new instance of InputBehavior.
   * @param accessor The control value accessor of the dynform.
   */
  public constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly accessor: ControlValueAccessor | ControlValueAccessor[],
  ) { }

  /**
   * Bind the behavior
   * @param dynForm The dynform to create the behavior.
   */
  public bind(dynForm: EditableDynForm<TValue, TData>): void {
    const accessor: ControlValueAccessor = this.correctAccessor;
    accessor.registerOnChange((value: DynFormValue<TValue>) => {
      if (typeof value === 'object' && 'value' in value)
        dynForm.writeValue(value);
      else dynForm.updateValue((oldValue) => ({ ...oldValue, value: value as any }));
      dynForm.markAsDirty();
    });
    accessor.registerOnTouched(() => dynForm.markAsTouched());
    this._valueSubscription = dynForm.value$.pipe(
      map((value: DynFormValue<TValue>) => value.label ?? value.value)
    ).subscribe((value: string | TValue) => accessor.writeValue(value));
    this._disabledSubscription = dynForm.disable$.subscribe((disabled: boolean) => {
      const { setDisabledState } = accessor;
      if (setDisabledState) setDisabledState.call(accessor, disabled);
    });
  }

  /**
   * Dispose the behavior
   */
  public dispose(): void {
    this._valueSubscription?.unsubscribe();
    this._disabledSubscription?.unsubscribe();
  }


  private get correctAccessor(): ControlValueAccessor {
    if (this.accessor) return [this.accessor].flat()[0];
    if (this.elementRef.nativeElement instanceof HTMLInputElement)
      return new InputAccessor(this.elementRef.nativeElement);
    throw new Error('No control value accessor found');
  }
}

import { BehaviorSubject, Observable, combineLatest, filter, firstValueFrom, map, merge, of, shareReplay, switchMap } from 'rxjs';
import { DynOperation } from '../../models/dynoperation.model';
import { DynValidator, DynValidatorError } from '../../models/dynvalidator.model';
import { UpdateValueFn, syncronizeValue } from '../../models/update-value.model';
import { DynFormValue } from '../../models/value.model';
import { DataDynFormOption, DataDynform } from './data.dynform';
/**
 * Represents am editable DynFormOption.
 *
 * @export
 * @interface EditableDynFormOption
 * @extends {DataDynFormOption<TValue, TData>}
 * @template TValue The type of the value.
 * @template TData The type of the data.
 */
export interface EditableDynFormOption<TValue, TData> extends DataDynFormOption<TValue, TData> {
  /**
   * The value operation of the form.
   *
   * @type {DynOperation<TValue, TData, TValue>}
   * @memberof EditableDynFormOption
   */
  value: DynOperation<TValue, TData, DynFormValue<TValue>>;
  /**
   * The hide operation of the form.
   *
   * @type {DynOperation<TValue, TData, boolean>}
   * @memberof EditableDynFormOption
   */
  hide: DynOperation<TValue, TData, boolean>;
  /**
   * The disable operation of the form.
   *
   * @type {DynOperation<TValue, TData, boolean>}
   * @memberof EditableDynFormOption
   */
  disable: DynOperation<TValue, TData, boolean>;
  /**
   * The validators operation of the form.
   *
   * @type {DynOperation<TValue, TData, DynValidator[]>}
   * @memberof EditableDynFormOption
   */
  validators: DynOperation<TValue, TData, DynValidator<TValue, TData>[]>;
}

/**
 * Represents an editable DynForm.
 * An editable DynForm is a DynForm that can be edited.
 * We can change the value, hide it, disable it, enable, show and hide the form.
 */
export class EditableDynForm<TValue, TData> extends DataDynform<TValue, TData> {
  /**
   * Buffer for the value.
   *
   * @private
   * @type {(BehaviorSubject<DynFormValue<TValue> | undefined>)}
   * @memberof EditableDynForm
   */
  private readonly _value$$: BehaviorSubject<DynFormValue<TValue> | undefined> = new BehaviorSubject<DynFormValue<TValue> | undefined>(undefined);
  /**
   * Buffer for the hide state.
   *
   * @private
   * @type {(BehaviorSubject<boolean | undefined>)}
   * @memberof EditableDynForm
   */
  private readonly _hide$$: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  /**
   * Buffer for the disable state.
   *
   * @private
   * @type {(BehaviorSubject<boolean | undefined>)}
   * @memberof EditableDynForm
   */
  private readonly _disable$$: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);

  /**
   * The value of the form.
   * @param editableOptions The options of the editable form.
   */
  public constructor(
    private readonly editableOptions: EditableDynFormOption<TValue, TData>
  ) { super(editableOptions); }

  /**
   * The value of the form.
   *
   * @type {Observable<DynFormValue<TValue>>}
   * @memberof EditableDynForm
   */
  public readonly value$: Observable<DynFormValue<TValue>> = merge(
    super.operate<DynFormValue<TValue>>(this.editableOptions.value),
    this._value$$.pipe(filter((value: DynFormValue<TValue> | undefined): value is DynFormValue<TValue> => value !== undefined)),
  ).pipe(shareReplay(1));

  /**
   * The hide state of the form.
   *
   * @type {Observable<boolean>}
   * @memberof EditableDynForm
   */
  public readonly hide$: Observable<boolean> = merge(
    this._hide$$.pipe(filter((hide: boolean | undefined): hide is boolean => hide !== undefined)),
    super.operate<boolean>(this.editableOptions.hide)
  ).pipe(shareReplay(1));

  /**
   * The visible state of the form.
   *
   * @type {Observable<boolean>}
   * @memberof EditableDynForm
   */
  public readonly visible$: Observable<boolean> = this.hide$.pipe(map((hide: boolean): boolean => !hide));

  /**
   * The disable state of the form.
   *
   * @type {Observable<boolean>}
   * @memberof EditableDynForm
   */
  public readonly disable$: Observable<boolean> = merge(
    this._disable$$.pipe(filter((disable: boolean | undefined): disable is boolean => disable !== undefined)),
    super.operate<boolean>(this.editableOptions.disable)
  ).pipe(shareReplay(1));

  /**
   * The enable state of the form.
   *
   * @type {Observable<boolean>}
   * @memberof EditableDynForm
   */
  public readonly enable$: Observable<boolean> = this.disable$.pipe(map((disable: boolean): boolean => !disable));

  /**
   * The validators of the form.
   *
   * @type {Observable<DynValidatorError[]>}
   * @memberof EditableDynForm
   */
  public readonly validatorsErrors$: Observable<DynValidatorError[]> = super.operate(this.editableOptions.validators).pipe(
    map((validatorOperations) => [() => of(undefined), ...validatorOperations].map((validatorOperation) => super.operate<DynValidatorError | undefined>(validatorOperation))),
    switchMap((validatorErrors$) => combineLatest(validatorErrors$)),
    map((validatorErrors) => validatorErrors.filter((validatorError) => validatorError !== undefined) as DynValidatorError[]),
  );

  /**
   * The valid state of the form.
   *
   * @type {Observable<boolean>}
   * @memberof EditableDynForm
   */
  public readonly valid$: Observable<boolean> = this.validatorsErrors$.pipe(map((validatorErrors) => validatorErrors.length === 0));
  /**
   * The invalid state of the form.
   *
   * @type {Observable<boolean>}
   * @memberof EditableDynForm
   */
  public readonly invalid$: Observable<boolean> = this.valid$.pipe(map((valid) => !valid));

  /**
   * Change the value of the form.
   * @param value The new value of the form.
   */
  public writeValue(value: DynFormValue<TValue>): void {
    this._value$$.next(value);
  }

  /**
   * Update the value of the form.
   * @param updateValueFn The function to update the value of the form.
   * @returns The promise of the updated value.
   */
  public async updateValue(updateValueFn: UpdateValueFn<DynFormValue<TValue>>): Promise<void> {
    const currentValue: DynFormValue<TValue> = await firstValueFrom(this.value$);
    const newValue: DynFormValue<TValue> = await syncronizeValue(updateValueFn, currentValue);
    this.writeValue(newValue);
  }

  /**
   * Patch the value of the form.
   * @param partialData The partial data to patch the value of the form.
   * @returns The promise of the patch value.
   */
  public patchValue(partialData: DynFormValue<Partial<TValue>>): Promise<void> {
    return this.updateValue((currentValue) => ({
      ...currentValue,
      value: Object.assign({}, currentValue.value, partialData.value)
    }));
  }

  /**
   * Set the disabled state of the form.
   * @param isDisabled The disabled state of the form.
   */
  public setDisabledState(isDisabled: boolean): void {
    this._disable$$.next(isDisabled);
  }

  /**
   * Update the disabled state of the form.
   * @param updateValueFn The function to update the disabled state of the form.
   */
  public async updateDisabledState(updateValueFn: UpdateValueFn<boolean>): Promise<void> {
    const currentDisabled: Awaited<boolean> = await firstValueFrom(this.disable$);
    const newDisabled: Awaited<boolean> = await syncronizeValue(updateValueFn, currentDisabled);
    this.setDisabledState(newDisabled);
  }

  /**
   * Set the enabled state of the form.
   * @param isEnabled The enabled state of the form.
   */
  public setEnabledState(isEnabled: boolean): void {
    this._disable$$.next(!isEnabled);
  }

  /**
   * Update the enabled state of the form.
   * @param updateValueFn The function to update the enabled state of the form.
   */
  public async updateEnabledState(updateValueFn: UpdateValueFn<boolean>): Promise<void> {
    const currentEnable: Awaited<boolean> = await firstValueFrom(this.enable$);
    const newEnable: Awaited<boolean> = await syncronizeValue(updateValueFn, currentEnable);
    this.setEnabledState(newEnable);
  }

  /**
   * Set the hide state of the form.
   * @param isHidden The hide state of the form.
   */
  public setHideState(isHidden: boolean): void {
    this._hide$$.next(isHidden);
  }

  /**
   * Update the hide state of the form.
   * @param updateValueFn The function to update the hide state of the form.
   */
  public async updateHideState(updateValueFn: UpdateValueFn<boolean>): Promise<void> {
    const currentHide: Awaited<boolean> = await firstValueFrom(this.hide$);
    const newHide: Awaited<boolean> = await syncronizeValue(updateValueFn, currentHide);
    this.setHideState(newHide);
  }

  /**
   * Set the visible state of the form.
   * @param isVisible The visible state of the form.
   */
  public setVisibleState(isVisible: boolean): void {
    this._hide$$.next(!isVisible);
  }

  /**
   * Update the visible state of the form.
   * @param updateValueFn The function to update the visible state of the form.
   */
  public async updateVisibleState(updateValueFn: UpdateValueFn<boolean>): Promise<void> {
    const currentVisible: Awaited<boolean> = await firstValueFrom(this.visible$);
    const newVisible: Awaited<boolean> = await syncronizeValue(updateValueFn, currentVisible);
    this.setVisibleState(newVisible);
  }

  /**
   * Show the form.
   */
  public show(): void {
    this.setVisibleState(true);
  }

  /**
   * Hide the form.
   */
  public hide(): void {
    this.setHideState(true);
  }

  /**
   * Enable the form.
   */
  public enable(): void {
    this.setEnabledState(true);
  }

  /**
   * Disable the form.
   */
  public disable(): void {
    this.setDisabledState(true);
  }
}

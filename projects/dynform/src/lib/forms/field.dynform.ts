import { BehaviorSubject, Observable, combineLatest, filter, firstValueFrom, map, merge, switchMap } from 'rxjs';
import { DynOperable, DynOperation } from '../models/dyn-operation.model';
import { DynValidator, DynValidatorError } from '../models/dyn-validator.model';
import { UpdateValueFn } from '../models/update-value.model';
import { DynFormValue } from '../models/value.model';
import { DynFormOptions } from './creator/dynform.creator';
import { DynFormContext } from './dynform-context.model';
import { DynFormStatus } from './dynform-status.model';
import { DynForm } from './dynform.model';

/**
 * The FieldDynForm class represents a form controller that is used to create a field.
 */
export class FieldDynForm<TValue, TData> implements DynForm<TValue, TData> {
  /**
   * The context of the controller.
   *
   * @private
   * @type {(BehaviorSubject<DynFormContext<TValue, TData> | undefined>)}
   * @memberof FieldDynForm
   */
  private readonly _context$$: BehaviorSubject<DynFormContext<TValue, TData> | undefined> = new BehaviorSubject<DynFormContext<TValue, TData> | undefined>(undefined);
  /**
   * The value of the controller.
   *
   * @private
   * @type {(BehaviorSubject<DynFormValue<TValue> | undefined>)}
   * @memberof FieldDynForm
   */
  private readonly _value$$: BehaviorSubject<DynFormValue<TValue> | undefined> = new BehaviorSubject<DynFormValue<TValue> | undefined>(undefined);
  /**
   * The data of the controller.
   *
   * @private
   * @type {(BehaviorSubject<TData | undefined>)}
   * @memberof FieldDynForm
   */
  private readonly _data$$: BehaviorSubject<TData | undefined> = new BehaviorSubject<TData | undefined>(undefined);
  /**
   * The disabled state of the controller.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof FieldDynForm
   */
  private readonly _disable$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * The touched state of the controller.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof FieldDynForm
   */
  private readonly _touched$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * The dirty state of the controller.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof FieldDynForm
   */
  private readonly _dirty$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * The invalid state of the controller.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof FieldDynForm
   */
  private readonly _invalid$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * The hidden state of the controller.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof FieldDynForm
   */
  private readonly _hidden$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * The placeholder of the controller.
   *
   * @private
   * @type {BehaviorSubject<string>}
   * @memberof FieldDynForm
   */
  private readonly _placeholder$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Creates an instance of FieldDynForm.
   * @param dynformOptions The options of the form controller.
   */
  public constructor(
    private readonly dynformOptions: DynFormOptions<TValue, TData>,
  ) { }

  /**
   * The placeholder of the controller.
   * @param placeholder The new placeholder for the controller.
   */
  public setPlaceholder(placeholder: string): void {
    this._placeholder$$.next(placeholder);
  }

  /**
   * Update the placeholder of the controller.
   * @param updateFn The function that will update the placeholder for the controller.
   */
  public updatePlaceholder(updateFn: UpdateValueFn<string>): void {
    firstValueFrom(this.placeholder$).then((placeholder) => this.setPlaceholder(updateFn(placeholder)));
  }

  /**
   * The value of the controller.
   *
   * @readonly
   * @type {(Observable<TValue | undefined>)}
   * @memberof FieldDynForm
   */
  public get value$(): Observable<DynFormValue<TValue> | undefined> {
    return merge(
      this._value$$,
      this.context$.pipe(
        switchMap((context) => this.dynformOptions.value(context)),
      ),
    );
  }

  /**
   * The data of the controller.
   *
   * @readonly
   * @type {(Observable<TData | undefined>)}
   * @memberof FieldDynForm
   */
  public get data$(): Observable<TData | undefined> {
    return merge(
      this._data$$,
      this.context$.pipe(
        switchMap((context: DynFormContext<TValue, TData>) => this.dynformOptions.data(context).pipe(
          switchMap((operableData: DynOperable<TValue, TData, TData>): Observable<TData> => {
            const entries$: Observable<{ key: string, value: TData[keyof TData] }>[] = Object.entries(operableData)
              .map(([key, operation]) => (operation as any as DynOperation<TValue, TData, any>)(context).pipe(
                map((value) => ({ key, value }))
              ));
            return combineLatest(entries$).pipe(
              map((entries) => entries.reduce((acc, entry) => ({ ...acc, [entry.key]: entry.value }), {} as TData))
            );
          })
        ))
      )
    );
  }

  /**
   * The disabled state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get disable$(): Observable<boolean> {
    return merge(
      this._disable$$,
      this.context$.pipe(
        switchMap((context) => this.dynformOptions.disabled(context))
      )
    );
  }

  /**
   * The enabled state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get enable$(): Observable<boolean> {
    return this.disable$.pipe(
      map((disable) => !disable)
    );
  }

  /**
   * The touched state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get touched$(): Observable<boolean> {
    return this._touched$$.asObservable();
  }

  /**
   * The untouched state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get untouched$(): Observable<boolean> {
    return this.touched$.pipe(
      map((touched) => !touched)
    );
  }

  /**
   * The dirty state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get dirty$(): Observable<boolean> {
    return this._dirty$$.asObservable();
  }

  /**
   * The pristine state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get pristine$(): Observable<boolean> {
    return this.dirty$.pipe(
      map((dirty) => !dirty)
    );
  }

  /**
   * The invalid state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get invalid$(): Observable<boolean> {
    return this._invalid$$.asObservable();
  }

  /**
   * The valid state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get valid$(): Observable<boolean> {
    return this.invalid$.pipe(
      map((invalid) => !invalid)
    );
  }

  /**
   * The status of the controller.
   *
   * @readonly
   * @type {Observable<DynFormStatus>}
   * @memberof FieldDynForm
   */
  public get status$(): Observable<DynFormStatus> {
    return this._context$$.pipe(
      map((context) => context ? DynFormStatus.RUNNING : DynFormStatus.WAITING)
    );
  }

  /**
   * The context of the controller.
   *
   * @readonly
   * @type {Observable<DynFormContext<TValue, TData>>}
   * @memberof FieldDynForm
   */
  public get context$(): Observable<DynFormContext<TValue, TData>> {
    return this._context$$.pipe(
      filter((context: DynFormContext<TValue, TData> | undefined): context is DynFormContext<TValue, TData> => context !== undefined)
    );
  }

  /**
   * The hidden state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get hidden$(): Observable<boolean> {
    return this.context$.pipe(
      switchMap((context) => this.dynformOptions.hide(context))
    );
  }

  /**
   * The visible state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get visible$(): Observable<boolean> {
    return this.hidden$.pipe(
      map((hidden) => !hidden)
    );
  }
  /**
   * The placeholder of the controller.
   *
   * @readonly
   * @type {Observable<string>}
   * @memberof FieldDynForm
   */
  public get placeholder$(): Observable<string> {
    return merge(
      this._placeholder$$,
      this.context$.pipe(
        switchMap((context) => this.dynformOptions.placeholder(context))
      )
    );
  }
  /**
   * The validators of the controller.
   *
   * @readonly
   * @type {Observable<DynValidator<TValue, TData>[]>}
   * @memberof FieldDynForm
   */
  public get validators$(): Observable<DynValidator<TValue, TData>[]> {
    return this.context$.pipe(
      switchMap((context) => this.dynformOptions.validators(context))
    );
  }
  /**
   * The errors of the controller.
   *
   * @readonly
   * @type {Observable<DynValidatorError[]>}
   * @memberof FieldDynForm
   */
  public get validatorsErrors$(): Observable<DynValidatorError[]> {
    return this.context$.pipe(
      switchMap((context) => this.dynformOptions.validators(context).pipe(
        map((validators) => validators.map((validator) => validator(context))),
        switchMap((validators) => combineLatest(validators)),
        map((errors) => errors.filter((error): error is DynValidatorError => error !== undefined))
      )),
    );
  }

  public setData(data: TData | undefined): void {
    this._data$$.next(data);
  }

  public updateData(updateFn: UpdateValueFn<TData | undefined>): void {
    firstValueFrom(this.data$).then((data) => this.setData(updateFn(data)));
  }

  public patchData(data: Partial<TData>): void {
    this.updateData((currentData) => Object.assign({}, currentData, data));
  }

  public setContext(context: DynFormContext<TValue, TData>): void {
    this._context$$.next(context);
  }

  public updateContext(updateFn: UpdateValueFn<DynFormContext<TValue, TData>>): void {
    firstValueFrom(this.context$).then((context) => this.setContext(updateFn(context)));
  }

  public writeValue(value: DynFormValue<TValue> | undefined): void {
    this._value$$.next(value);
  }

  public updateValue(updateFn: UpdateValueFn<DynFormValue<TValue> | undefined>): void {
    firstValueFrom(this.value$).then((value) => this.writeValue(updateFn(value)));
  }

  public patchValue(value: DynFormValue<Partial<TValue>>): void {
    this.updateValue((currentValue) => Object.assign({}, currentValue, value));
  }

  public setEnableState(enable: boolean): void {
    this._disable$$.next(!enable);
  }

  public updateEnableState(updateFn: UpdateValueFn<boolean>): void {
    firstValueFrom(this.enable$).then((enable) => this.setEnableState(updateFn(enable)));
  }

  public setDisableState(disable: boolean): void {
    this.setEnableState(!disable);
  }

  public updateDisableState(updateFn: UpdateValueFn<boolean>): void {
    firstValueFrom(this.disable$).then((disable) => this.setDisableState(updateFn(disable)));
  }

  public setTouchedState(touched: boolean): void {
    this._touched$$.next(touched);
  }

  public updateTouchedState(updateFn: UpdateValueFn<boolean>): void {
    this._touched$$.next(updateFn(this._touched$$.value));
  }

  public setUntouchedState(untouched: boolean): void {
    this.setTouchedState(!untouched);
  }

  public updateUntouchedState(updateFn: UpdateValueFn<boolean>): void {
    firstValueFrom(this.untouched$).then((untouched) => this.setUntouchedState(updateFn(untouched)));
  }

  public setDirtyState(dirty: boolean): void {
    this._dirty$$.next(dirty);
  }

  public updateDirtyState(updateFn: UpdateValueFn<boolean>): void {
    this._dirty$$.next(updateFn(this._dirty$$.value));
  }

  public setPristineState(pristine: boolean): void {
    this.setDirtyState(!pristine);
  }

  public updatePristineState(updateFn: UpdateValueFn<boolean>): void {
    firstValueFrom(this.pristine$).then((pristine) => this.setPristineState(updateFn(pristine)));
  }

  public setValidState(valid: boolean): void {
    this._invalid$$.next(!valid);
  }

  public updateValidState(updateFn: UpdateValueFn<boolean>): void {
    firstValueFrom(this.valid$).then((valid) => this.setValidState(updateFn(valid)));
  }

  public setInvalidState(invalid: boolean): void {
    this.setValidState(!invalid);
  }

  public updateInvalidState(updateFn: UpdateValueFn<boolean>): void {
    firstValueFrom(this.invalid$).then((invalid) => this.setInvalidState(updateFn(invalid)));
  }

  public setHidden(hide: boolean): void {
    this._hidden$$.next(hide);
  }

  public updateHidden(updateFn: UpdateValueFn<boolean>): void {
    firstValueFrom(this.hidden$).then((hide) => this.setHidden(updateFn(hide)));
  }

  public setVisible(visible: boolean): void {
    this.setHidden(!visible);
  }

  public updateVisible(updateFn: UpdateValueFn<boolean>): void {
    firstValueFrom(this.visible$).then((visible) => this.setVisible(updateFn(visible)));
  }
}

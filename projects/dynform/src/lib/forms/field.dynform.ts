import { BehaviorSubject, EMPTY, Observable, combineLatest, filter, firstValueFrom, map, merge, mergeAll, of, switchMap } from 'rxjs';
import { DynOperable, DynOperation } from '../models/dyn-operation.model';
import { DynValidatorError } from '../models/dyn-validator.model';
import { UpdateValueFn, syncronizeValue } from '../models/update-value.model';
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
   * The disabled state of the controller.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof FieldDynForm
   */
  private readonly _disable$$: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
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
   * The hidden state of the controller.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof FieldDynForm
   */
  private readonly _hidden$$: BehaviorSubject<boolean| undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  /**
   * The placeholder of the controller.
   *
   * @private
   * @type {BehaviorSubject<string>}
   * @memberof FieldDynForm
   */
  private readonly _placeholder$$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  /**
   * Store the datas
   *
   * @private
   * @type {Map<keyof TData, BehaviorSubject<TData[keyof TData]>>}
   * @memberof FieldDynForm
   */
  private readonly _dataMap: Map<keyof TData, BehaviorSubject<TData[keyof TData] | undefined>> = new Map<keyof TData, BehaviorSubject<TData[keyof TData] | undefined>>();

  /**
   * Creates an instance of FieldDynForm.
   * @param dynformOptions The options of the form controller.
   */
  public constructor(
    private readonly dynformOptions: DynFormOptions<TValue, TData>,
  ) { }

  /**
   * The value of the controller.
   *
   * @readonly
   * @type {(Observable<TValue | undefined>)}
   * @memberof FieldDynForm
   */
  public get value$(): Observable<DynFormValue<TValue> | undefined> {
    return merge([
      this._value$$.asObservable(),
      this.context$.pipe(switchMap((context: DynFormContext<TValue, TData>) => this.dynformOptions.value(context))),
    ]).pipe(mergeAll());
  }

  /**
   * The data of the controller.
   *
   * @readonly
   * @type {(Observable<TData | undefined>)}
   * @memberof FieldDynForm
   */
  public get data$(): Observable<TData> {
    return this.context$.pipe(
      switchMap((context: DynFormContext<TValue, TData>) => this.dynformOptions.data(context).pipe(
        map((operableData) => Object.entries(operableData as DynOperable<TValue, TData, TData>) as [keyof TData, DynOperation<TValue, TData, TData[keyof TData]>][]),
        map((operableEntries) => operableEntries.concat([...this._dataMap.keys()].map((key) => [key, () => EMPTY]))),
        map((operableEntries) => operableEntries.filter(([key], index, array) => array.findIndex(([searchKey]) => searchKey === key) === index)),
        map((operableEntries) => operableEntries.map(([key, operation]) => {
          const operation$: Observable<TData[keyof TData]> = operation(context);
          const data$: Observable<TData[keyof TData]> = this.getDataByKey(key).pipe(filter((data): data is TData[keyof TData] => data !== undefined));
          return merge(operation$, data$).pipe(map((result) => ({ [key]: result })));
        })),
      )),
      switchMap((entries) => combineLatest(entries)),
      map((entries) => entries.reduce((acc, entry) => Object.assign(acc, entry), {})),
    ) as Observable<TData>;
  }

  /**
   * The disabled state of the controller.
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof FieldDynForm
   */
  public get disable$(): Observable<boolean> {
    return merge([
      this._disable$$.pipe(filter((disable): disable is boolean => disable !== undefined)),
      this.context$.pipe(switchMap((context) => this.dynformOptions.disabled(context))),
    ]).pipe(mergeAll());
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
        switchMap((validators) => validators.length > 0 ? combineLatest(validators) : of([])),
        map((errors) => errors.filter((error): error is DynValidatorError => error !== undefined))
      )),
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
    return this.validatorsErrors$.pipe(
      map((errors) => errors.length > 0),
    );
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
    return merge([
      this._hidden$$.pipe(filter((hidden): hidden is boolean => hidden !== undefined)),
      this.context$.pipe(switchMap((context) => this.dynformOptions.hide(context))),
    ]).pipe(mergeAll());
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
    return merge([
      this._placeholder$$.pipe(filter((placeholder): placeholder is string => placeholder !== undefined)),
      this.context$.pipe(switchMap((context) => this.dynformOptions.placeholder(context)))
    ]).pipe(mergeAll());
  }

  public setData(data: Partial<TData>): void {
    const partialEntries: [keyof TData, TData[keyof TData]][] = Object.entries(data) as [keyof TData, TData[keyof TData]][];
    for (const [key, value] of partialEntries) {
      const data$$: BehaviorSubject<TData[keyof TData] | undefined> = this.getDataByKey(key);
      data$$.next(value);
    }
  }

  public async updateData(updateFn: UpdateValueFn<Partial<TData>>): Promise<void> {
    const currentValue: Partial<TData> = await firstValueFrom(this.data$);
    const newValue: Partial<TData> = await syncronizeValue(updateFn, currentValue);
    this.setData(newValue);
  }

  public patchData(data: Partial<TData>): Promise<void> {
    return this.updateData((currentData) => Object.assign({}, currentData, data));
  }

  public setContext(context: DynFormContext<TValue, TData>): void {
    this._context$$.next(context);
  }

  public async updateContext(updateFn: UpdateValueFn<DynFormContext<TValue, TData>>): Promise<void> {
    const currentValue: DynFormContext<TValue, TData> | undefined = await firstValueFrom(this.context$);
    const newValue: DynFormContext<TValue, TData> | undefined = await syncronizeValue(updateFn, currentValue);
    this.setContext(newValue);
  }

  public writeValue(value: DynFormValue<TValue> | undefined): void {
    this._value$$.next(value);
  }

  public async updateValue(updateFn: UpdateValueFn<DynFormValue<TValue> | undefined>): Promise<void> {
    const currentValue: DynFormValue<TValue> | undefined = await firstValueFrom(this.value$);
    const newValue: DynFormValue<TValue> | undefined = await syncronizeValue(updateFn, currentValue);
    this.writeValue(newValue);
  }

  public patchValue(value: DynFormValue<Partial<TValue>>): Promise<void> {
    return this.updateValue((currentValue: DynFormValue<TValue> | undefined) => {
      if (currentValue === undefined) return value as DynFormValue<TValue> | undefined;
      const oldValue: Partial<TValue> = currentValue.value;
      const newValue: Partial<TValue> = Object.assign({}, oldValue, value.value);
      return { ...currentValue, value: newValue };
    });
  }

  public setEnableState(enable: boolean): void {
    this._disable$$.next(!enable);
  }

  public async updateEnableState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    const currentValue: boolean = await firstValueFrom(this.enable$);
    const newValue: boolean = await syncronizeValue(updateFn, currentValue);
    this.setEnableState(newValue);
  }

  public enable(): void {
    this.setEnableState(true);
  }

  public setDisableState(disable: boolean): void {
    this.setEnableState(!disable);
  }

  public async updateDisableState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    const currentValue: boolean = await firstValueFrom(this.disable$);
    const newValue: boolean = await syncronizeValue(updateFn, currentValue);
    this.setDisableState(newValue);
  }

  public disable(): void {
    this.setDisableState(true);
  }

  public setTouchedState(touched: boolean): void {
    this._touched$$.next(touched);
  }

  public async updateTouchedState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    const currentValue: boolean = await firstValueFrom(this.touched$);
    const newValue: boolean = await syncronizeValue(updateFn, currentValue);
    this.setTouchedState(newValue);
  }

  public setUntouchedState(untouched: boolean): void {
    this.setTouchedState(!untouched);
  }

  public async updateUntouchedState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    const currentValue: boolean = await firstValueFrom(this.untouched$);
    const newValue: boolean = await syncronizeValue(updateFn, currentValue);
    this.setUntouchedState(newValue);
  }

  public setDirtyState(dirty: boolean): void {
    this._dirty$$.next(dirty);
  }

  public async updateDirtyState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    const currentValue: boolean = await firstValueFrom(this.dirty$);
    const newValue: boolean = await syncronizeValue(updateFn, currentValue);
    this.setDirtyState(newValue);
  }

  public setPristineState(pristine: boolean): void {
    this.setDirtyState(!pristine);
  }

  public async updatePristineState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    const currentValue: boolean = await firstValueFrom(this.pristine$);
    const newValue: boolean = await syncronizeValue(updateFn, currentValue);
    this.setPristineState(newValue);
  }

  public setHidden(hide: boolean): void {
    this._hidden$$.next(hide);
  }

  public async updateHidden(updateFn: UpdateValueFn<boolean>): Promise<void> {
    const currentValue: boolean = await firstValueFrom(this.hidden$);
    const newValue: boolean = await syncronizeValue(updateFn, currentValue);
    this.setHidden(newValue);
  }

  public hide(): void {
    this.setHidden(true);
  }

  public setVisible(visible: boolean): void {
    this.setHidden(!visible);
  }

  public async updateVisible(updateFn: UpdateValueFn<boolean>): Promise<void> {
    const currentValue: boolean = await firstValueFrom(this.visible$);
    const newValue: boolean = await syncronizeValue(updateFn, currentValue);
    this.setVisible(newValue);
  }

  public show(): void {
    this.setVisible(true);
  }

  public setPlaceholder(placeholder: string): void {
    this._placeholder$$.next(placeholder);
  }

  public async updatePlaceholder(updateFn: UpdateValueFn<string>): Promise<void> {
    const currentValue: string = await firstValueFrom(this.placeholder$);
    const newValue: string = await syncronizeValue(updateFn, currentValue);
    this.setPlaceholder(newValue);
  }

  private getDataByKey(key: keyof TData): BehaviorSubject<TData[keyof TData] | undefined> {
    const data$$: BehaviorSubject<TData[keyof TData] | undefined> | undefined = this._dataMap.get(key);
    if (data$$) return data$$;
    const newData$$: BehaviorSubject<TData[keyof TData] | undefined> = new BehaviorSubject<TData[keyof TData] | undefined>(undefined);
    this._dataMap.set(key, newData$$);
    return newData$$;
  }
}

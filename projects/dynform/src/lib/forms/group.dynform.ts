import { BehaviorSubject, EMPTY, Observable, combineLatest, concatMap, distinctUntilChanged, filter, firstValueFrom, map, merge, shareReplay } from 'rxjs';
import { DynOperable, DynOperation } from '../models/dyn-operation.model';
import { DynValidatorError } from '../models/dyn-validator.model';
import { UpdateValueFn, syncronizeValue } from '../models/update-value.model';
import { DynFormValue } from '../models/value.model';
import { ChildDynForm, DynFormGroupOptions } from './creator/dynform-group.creator';
import { DynFormContext } from './dynform-context.model';
import { DynFormStatus } from './dynform-status.model';
import { DynForm } from './dynform.model';

/**
 * Represents a group form controller.
 */
export class GroupDynForm<TValue, TData> implements DynForm<TValue, TData> {
  /**
   * The options of the form controller.
   *
   * @private
   * @type {(BehaviorSubject<DynFormContext<TValue, TData> | undefined>)}
   * @memberof GroupDynForm
   */
  private readonly _context$$: BehaviorSubject<DynFormContext<TValue, TData> | undefined> = new BehaviorSubject<DynFormContext<TValue, TData> | undefined>(undefined);
  /**
   * Store the datas
   *
   * @private
   * @type {Map<keyof TData, BehaviorSubject<TData[keyof TData]>>}
   * @memberof FieldDynForm
   */
  private readonly _dataMap: Map<keyof TData, BehaviorSubject<TData[keyof TData] | undefined>> = new Map<keyof TData, BehaviorSubject<TData[keyof TData] | undefined>>();

  /**
   * Creates an instance of GroupDynForm.
   * @param dynformGroupOptions The options of the form controller.
   * @param dynformOptions The options of the form controller.
   */
  public constructor(
    private readonly dynformGroupOptions: DynFormGroupOptions<TValue, TData>,
  ) { }

  /**
   * Gets a child dynform by its name.
   * @param name The name of the child dynform.
   * @returns The child dynform.
   */
  public get(name: keyof TValue): DynForm<TValue[keyof TValue], TData> {
    const child: ChildDynForm<TValue[keyof TValue], TData, keyof TValue> | undefined = this.dynformGroupOptions.children.find((child) => child.key === name);
    if (child === undefined) throw new Error(`The child dynform with the name "${name as string}" does not exist.`);
    return child.form;
  }

  /**
   * Gets the value of the form controller.
   *
   * @type {Observable<DynFormContext<TValue, TData>>}
   * @memberof GroupDynForm
   */
  public readonly context$: Observable<DynFormContext<TValue, TData>> = this._context$$.pipe(
    filter((context): context is DynFormContext<TValue, TData> => context !== undefined),
  );

  /**
   * Gets the value of the form controller.
   *
   * @type {(Observable<DynFormValue<TValue> | undefined>)}
   * @memberof GroupDynForm
   */
  public readonly value$: Observable<DynFormValue<TValue> | undefined> = combineLatest(this.dynformGroupOptions.children.map((child) => {
    const { key, form } = child;
    return form.value$.pipe(map((value) => ({ [key]: value?.value })));
  })).pipe(
    map((results) => results.reduce((previous, current) => Object.assign(previous, current), {} as { [x in keyof TValue]: DynFormValue<TValue[keyof TValue]> | undefined; })),
    distinctUntilChanged((prev, current) => JSON.stringify(prev) === JSON.stringify(current)),
    map((value) => ({ value } as DynFormValue<TValue>)),
    shareReplay(1),
  );

  /**
   * The data of the controller.
   *
   * @readonly
   * @type {(Observable<TData | undefined>)}
   * @memberof FieldDynForm
   */
  public readonly data$: Observable<TData> = this.context$.pipe(
    concatMap((context: DynFormContext<TValue, TData>) => this.dynformGroupOptions.data(context).pipe(
      map((operableData) => Object.entries(operableData as DynOperable<TValue, TData, TData>) as [keyof TData, DynOperation<TValue, TData, TData[keyof TData]>][]),
      map((operableEntries) => operableEntries.concat([...this._dataMap.keys()].map((key) => [key, () => EMPTY]))),
      map((operableEntries) => operableEntries.filter(([key], index, array) => array.findIndex(([searchKey]) => searchKey === key) === index)),
      map((operableEntries) => operableEntries.map(([key, operation]) => {
        const operation$: Observable<TData[keyof TData]> = operation(context);
        const data$: Observable<TData[keyof TData]> = this.getDataByKey(key).pipe(filter((data): data is TData[keyof TData] => data !== undefined));
        return merge(operation$, data$).pipe(map((result) => ({ [key]: result })));
      })),
    )),
    concatMap((entries) => combineLatest(entries)),
    map((entries) => entries.reduce((acc, entry) => Object.assign(acc, entry), {})),
    distinctUntilChanged((prev, current) => JSON.stringify(prev) === JSON.stringify(current)),
    shareReplay(1),
  ) as Observable<TData>;

  enable$!: Observable<boolean>;
  disable$!: Observable<boolean>;
  touched$!: Observable<boolean>;
  untouched$!: Observable<boolean>;
  dirty$!: Observable<boolean>;
  pristine$!: Observable<boolean>;
  valid$!: Observable<boolean>;
  invalid$!: Observable<boolean>;
  status$!: Observable<DynFormStatus>;
  hidden$!: Observable<boolean>;
  visible$!: Observable<boolean>;
  validatorsErrors$!: Observable<DynValidatorError[]>;

  public writeValue(value: DynFormValue<TValue> | undefined): void {
    for (const childForm of this.dynformGroupOptions.children) {
      const form: DynForm<TValue[keyof TValue], TData> = childForm.form;
      const childValue: TValue[keyof TValue] = value?.value[childForm.key] as TValue[keyof TValue];
      form.writeValue({ value: childValue } as DynFormValue<TValue[keyof TValue]>);
    }
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
    throw new Error('Method not implemented.');
  }

  setEnableState(enable: boolean): void {
    throw new Error('Method not implemented.');
  }
  updateEnableState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setDisableState(disable: boolean): void {
    throw new Error('Method not implemented.');
  }
  enable(): void {
    throw new Error('Method not implemented.');
  }
  disable(): void {
    throw new Error('Method not implemented.');
  }
  updateDisableState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setTouchedState(touched: boolean): void {
    throw new Error('Method not implemented.');
  }
  updateTouchedState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setUntouchedState(untouched: boolean): void {
    throw new Error('Method not implemented.');
  }
  updateUntouchedState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setDirtyState(dirty: boolean): void {
    throw new Error('Method not implemented.');
  }
  updateDirtyState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setPristineState(pristine: boolean): void {
    throw new Error('Method not implemented.');
  }
  updatePristineState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setHidden(hide: boolean): void {
    throw new Error('Method not implemented.');
  }
  updateHidden(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setVisible(visible: boolean): void {
    throw new Error('Method not implemented.');
  }
  updateVisible(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  show(): void {
    throw new Error('Method not implemented.');
  }
  hide(): void {
    throw new Error('Method not implemented.');
  }

  private getDataByKey(key: keyof TData): BehaviorSubject<TData[keyof TData] | undefined> {
    const data$$: BehaviorSubject<TData[keyof TData] | undefined> | undefined = this._dataMap.get(key);
    if (data$$) return data$$;
    const newData$$: BehaviorSubject<TData[keyof TData] | undefined> = new BehaviorSubject<TData[keyof TData] | undefined>(undefined);
    this._dataMap.set(key, newData$$);
    return newData$$;
  }
}

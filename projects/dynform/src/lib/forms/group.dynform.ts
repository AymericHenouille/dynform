import { Observable, combineLatest, map } from 'rxjs';
import { DynValidator, DynValidatorError } from '../models/dyn-validator.model';
import { UpdateValueFn } from '../models/update-value.model';
import { DynFormValue } from '../models/value.model';
import { DynFormGroupOptions } from './creator/dynform-group.creator';
import { DynFormContext } from './dynform-context.model';
import { DynFormStatus } from './dynform-status.model';
import { DynForm } from './dynform.model';

export class GroupDynForm<TValue, TData> implements DynForm<TValue, TData> {
  public constructor(
    private readonly dynformGroupOptions: DynFormGroupOptions<TValue, TData>,
  ) { }

  public get value$(): Observable<DynFormValue<TValue> | undefined> {
    const entries: [keyof TValue, DynForm<TValue[keyof TValue], any>][] = Object.entries(this.dynformGroupOptions) as [keyof TValue, DynForm<TValue[keyof TValue], any>][];
    const values$: Observable<{ [x: string]: DynFormValue<TValue[keyof TValue]> | undefined; }>[] = entries.map(([key, dynform]) => dynform?.value$.pipe(map(value => ({ [key]: value }))));
    return combineLatest(values$).pipe(
      map(values => values.reduce((acc, value) => ({ ...acc, ...value }), {} as TValue)),
      map((value) => ({ value }))
    );
  }

  public get data$(): Observable<Partial<TData>> {
    throw new Error('Method not implemented.');
  }

  public get disable$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get enable$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get touched$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get untouched$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get dirty$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get pristine$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get invalid$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get valid$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get status$(): Observable<DynFormStatus> {
    throw new Error('Method not implemented.');
  }

  public get context$(): Observable<DynFormContext<TValue, TData>> {
    throw new Error('Method not implemented.');
  }

  public get hidden$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get visible$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public get placeholder$(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  public get validators$(): Observable<DynValidator<TValue, TData>[]> {
    throw new Error('Method not implemented.');
  }

  public get validatorsErrors$(): Observable<DynValidatorError[]> {
    throw new Error('Method not implemented.');
  }

  public getChild<Key extends keyof TValue>(key: Key): DynForm<TValue[Key], TData> {
    return this.dynformGroupOptions[key];
  }

  public setData(data: Partial<TData>): void {
    throw new Error('Method not implemented.');
  }

  public updateData(updateFn: UpdateValueFn<Partial<TData>>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public patchData(data: Partial<TData>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public setContext(context: DynFormContext<TValue, TData>): void {
    throw new Error('Method not implemented.');
  }

  public updateContext(updateFn: UpdateValueFn<DynFormContext<TValue, TData>>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public writeValue(value: DynFormValue<TValue> | undefined): void {
    throw new Error('Method not implemented.');
  }

  public updateValue(updateFn: UpdateValueFn<DynFormValue<TValue> | undefined>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public patchValue(value: DynFormValue<Partial<TValue>>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public setEnableState(enable: boolean): void {
    throw new Error('Method not implemented.');
  }

  public updateEnableState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public enable(): void {
    throw new Error('Method not implemented.');
  }

  public setDisableState(disable: boolean): void {
    throw new Error('Method not implemented.');
  }

  public updateDisableState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public disable(): void {
    throw new Error('Method not implemented.');
  }

  public setTouchedState(touched: boolean): void {
    throw new Error('Method not implemented.');
  }

  public updateTouchedState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public setUntouchedState(untouched: boolean): void {
    throw new Error('Method not implemented.');
  }

  public updateUntouchedState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public setDirtyState(dirty: boolean): void {
    throw new Error('Method not implemented.');
  }

  public updateDirtyState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public setPristineState(pristine: boolean): void {
    throw new Error('Method not implemented.');
  }

  public updatePristineState(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public setHidden(hide: boolean): void {
    throw new Error('Method not implemented.');
  }

  public updateHidden(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public hide(): void {
    throw new Error('Method not implemented.');
  }

  public setVisible(visible: boolean): void {
    throw new Error('Method not implemented.');
  }

  public updateVisible(updateFn: UpdateValueFn<boolean>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public show(): void {
    throw new Error('Method not implemented.');
  }

  public setPlaceholder(placeholder: string): void {
    throw new Error('Method not implemented.');
  }

  public updatePlaceholder(updateFn: UpdateValueFn<string>): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

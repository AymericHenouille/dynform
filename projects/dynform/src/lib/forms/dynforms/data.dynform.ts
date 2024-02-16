import { BehaviorSubject, Observable, combineLatest, concatMap, filter, firstValueFrom, map, merge, shareReplay } from 'rxjs';
import { DynOperable, DynOperationValue } from '../../models/dynoperation.model';
import { UpdateValueFn, syncronizeValue } from '../../models/update-value.model';
import { ContextDynForm } from './context.dynform';

/**
 * Represents the data option of a DynForm.
 * @template TValue The type of the value.
 * @template TData The type of the data.
 * @template TOperation The type of the operation.
 */
export interface DataDynFormOption<TValue, TData> {
  /**
   * The data of the form.
   */
  data: DynOperable<TValue, TData, TData>;
};

/**
 * Represents a DynForm with a context and data.
 * @template TValue The type of the value.
 * @template TData The type of the data.
 */
export class DataDynform<TValue, TData> extends ContextDynForm<TValue, TData> {
  /**
   * Buffer for the data.
   *
   * @private
   * @type {(BehaviorSubject<TData | undefined>)}
   * @memberof DataDynform
   */
  private readonly _data$$: BehaviorSubject<TData | undefined> = new BehaviorSubject<TData | undefined>(undefined);

  /**
   * The data of the form.
   *
   * @readonly
   * @type {Observable<TData>}
   * @memberof DataDynform
   */
  public constructor(
    private readonly data: DataDynFormOption<TValue, TData>
  ) { super(); }

  /**
   * The data of the form.
   *
   * @type {Observable<TData>}
   * @memberof DataDynform
   */
  public readonly data$: Observable<TData> = super.operate<DynOperationValue<DynOperable<TValue, TData, TData>>>(this.data.data).pipe(
    map((data) => {
      const keys: (keyof TData)[] = Object.keys(data) as (keyof TData)[];
      return keys.map((key) => merge(
        this._data$$.pipe(
          filter((data: TData | undefined): data is TData => data !== undefined),
          map((data) => data[key])
        ),
        super.operate(data[key])
      ).pipe(map((value) => ({ key, value }))));
    }),
    concatMap((observables) => combineLatest(observables)),
    map((keyValues) => keyValues.reduce((acc, { key, value }) => Object.assign({}, acc, { [key]: value }), {} as TData)),
    shareReplay(1)
  );

  /**
   * Sets the data of the form.
   * @param data The data of the form.
   */
  public setData(data: TData): void {
    this._data$$.next(data);
  }

  /**
   * Updates the data of the form.
   * @param updateFn The function to update the data.
   * @returns A promise that resolves when the data is updated.
   */
  public async updateData(updateFn: UpdateValueFn<TData>): Promise<void> {
    const currentData: TData = await firstValueFrom(this.data$);
    const newData: TData = await syncronizeValue(updateFn, currentData);
    this.setData(newData);
  }

  /**
   * Patches the data of the form.
   * @param partialData The partial data to patch the form data.
   * @returns A promise that resolves when the data is patched.
   */
  public patchData(partialData: Partial<TData>): Promise<void> {
    return this.updateData((data) => Object.assign({}, data, partialData));
  }
}

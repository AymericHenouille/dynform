import { BehaviorSubject, Observable, filter, firstValueFrom, merge, shareReplay } from 'rxjs';
import { DynOperation } from '../../models/dynoperation.model';
import { UpdateValueFn, syncronizeValue } from '../../models/update-value.model';
import { EditableDynForm, EditableDynFormOption } from './editable.dynform';

/**
 * Options to create a new DynForm instance.
 */
export interface FieldDynFormOptions<TValue, TData> extends EditableDynFormOption<TValue, TData> {
  /**
   * Operation to determine the placeholder of the form.
   */
  placeholder: DynOperation<TValue, TData, string>;
}

/**
 * Represents a DynForm that is used to display a field.
 */
export class FieldDynForm<TValue, TData> extends EditableDynForm<TValue, TData> {
  /**
   * Placeholder buffer of the form.
   *
   * @private
   * @type {(BehaviorSubject<string | undefined>)}
   * @memberof FieldDynForm
   */
  private readonly _placeholder$$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  /**
   * Placeholder of the form.
   * @param fieldOptions Options to create a new FieldDynForm instance.
   */
  public constructor(
    private readonly fieldOptions: FieldDynFormOptions<TValue, TData>
  ) { super(fieldOptions); }

  /**
   * Placeholder of the form.
   */
  public readonly placeholder$: Observable<string> = merge(
    this._placeholder$$.pipe(filter((placeholder: string | undefined): placeholder is string => placeholder !== undefined)),
    super.operate(this.fieldOptions.placeholder)
  ).pipe(shareReplay(1));

  /**
   * Set the Placeholder of the form.
   */
  public setPlaceholder(placeholder: string) {
    this._placeholder$$.next(placeholder);
  }

  /**
   * Get the placeholder of the form.
   */
  public async updatePlaceholder(updateFn: UpdateValueFn<string>): Promise<void> {
    const placeholder: string = await firstValueFrom(this.placeholder$);
    const newPlaceholder: string = await syncronizeValue(updateFn, placeholder);
    this.setPlaceholder(newPlaceholder);
  }
}

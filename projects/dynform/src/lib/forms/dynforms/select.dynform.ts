import { Observable, combineLatest, map, mergeMap, of } from 'rxjs';
import { DynOperation } from '../../models/dynoperation.model';
import { DynFormValue } from '../../models/value.model';
import { FieldDynForm, FieldDynFormOptions } from './field.dynform';

/**
 * Represents a select DynFormOption.
 */
export interface SelectDynFormOption<TValue, TData> extends FieldDynFormOptions<TValue, TData> {
  /**
   * The options of the select.
   */
  options: DynOperation<TValue, TData, DynOperation<TValue, TData, DynFormValue<TValue>>[]>;
}

/**
 * Represents a select DynForm.
 */
export class SelectDynForm<TValue, TData> extends FieldDynForm<TValue, TData> {
  /**
   * Creates a new instance of SelectDynForm.
   * @param options Options to create a new SelectDynForm instance.
   */
  public constructor(
    private readonly options: SelectDynFormOption<TValue, TData>
  ) { super(options); }

  /**
   * The options of the select.
   *
   * @type {Observable<DynFormValue<TValue>[]>}
   * @memberof SelectDynForm
   */
  public readonly options$: Observable<DynFormValue<TValue>[]> = super.operate(this.options.options).pipe(
    map((operations) => operations.map((operation) => super.operate(operation))),
    mergeMap((operationResults) => operationResults.length > 0 ? combineLatest(operationResults) : of([])),
  );
}

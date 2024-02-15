import { EMPTY, of } from 'rxjs';
import { DynOperable, DynOperation } from '../../models/dyn-operation.model';
import { DynValidator } from '../../models/dyn-validator.model';
import { DynFormValue } from '../../models/value.model';
import { FieldDynForm } from '../field.dynform';

/**
 * Options to create a new DynForm instance.
 */
export interface DynFormOptions<TValue, TData> {
  /**
   * Operation to determine if the form should be hidden.
   */
  hide: DynOperation<TValue, TData, boolean>;
  /**
   * Operation to determine if the form should be disabled.
   */
  disabled: DynOperation<TValue, TData, boolean>;
  /**
   * Operation to determine the value of the form.
   */
  value: DynOperation<TValue, TData, DynFormValue<TValue>>;
  /**
   * Operation to determine the placeholder of the form.
   */
  placeholder: DynOperation<TValue, TData, string>;
  /**
   * Operation to determine the validators of the form.
   */
  validators: DynOperation<TValue, TData, DynValidator<TValue, TData>[]>;
  /**
   * Operation to determine the data of the form.
   */
  data: DynOperation<TValue, TData, DynOperable<TValue, TData, TData>>;
}

/**
 * Create a new DynForm with default options.
 * The default options are:
 * - hide: false
 * - disabled: false
 * - value: undefined
 * - placeholder: ''
 * - validators: []
 * - data: undefined
 * @param options Partial options to override the default ones.
 * @returns A new DynForm instance.
 */
export function createDynForm<TValue, TData>(options: Partial<DynFormOptions<TValue, TData>> = {}): FieldDynForm<TValue, TData> {
  const fullOptions: DynFormOptions<TValue, TData> = Object.assign({
    hide: () => of(false),
    disabled: () => of(false),
    value: () => of(undefined),
    placeholder: () => of(''),
    validators: () => of([]),
    data: () => EMPTY,
  }, options);
  return new FieldDynForm<TValue, TData>(fullOptions);
}

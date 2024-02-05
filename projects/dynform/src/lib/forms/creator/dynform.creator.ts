import { DynOperable, DynOperation } from '../../models/dyn-operation.model';
import { DynValidator } from '../../models/dyn-validator.model';
import { DynFormValue } from '../../models/value.model';
import { currentData, currentDisabled, currentHide, currentPlaceholder, currentValidators, currentValue } from '../../operators/current.operator';
import { DynForm } from '../dynform.model';
import { FieldDynForm } from '../field.dynform';

export interface DynFormOptions<TValue, TData> {
  hide: DynOperation<TValue, TData, boolean>;
  disabled: DynOperation<TValue, TData, boolean>;
  value: DynOperation<TValue, TData, DynFormValue<TValue>>;
  placeholder: DynOperation<TValue, TData, string>;
  validators: DynOperation<TValue, TData, DynValidator<TValue, TData>[]>;
  data: DynOperation<TValue, TData, DynOperable<TValue, TData, TData>>;
}

export function createDynForm<TValue, TData>(options: Partial<DynFormOptions<TValue, TData>>): DynForm<TValue, TData> {
  const fullOptions: DynFormOptions<TValue, TData> = Object.assign({
    hide: currentHide(),
    disabled: currentDisabled(),
    value: currentValue(),
    placeholder: currentPlaceholder(),
    validators: currentValidators(),
    data: currentData(),
  }, options);
  return new FieldDynForm(fullOptions);
}

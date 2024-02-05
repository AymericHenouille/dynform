import { DynOperation } from '../models/dyn-operation.model';
import { DynFormValue } from '../models/value.model';

export function currentHide<TValue, TData>(): DynOperation<TValue, TData, boolean> {
  return (context) => context.dynForm.hidden$;
}

export function currentDisabled<TValue, TData>(): DynOperation<TValue, TData, boolean> {
  return (context) => context.dynForm.disable$;
}

export function currentValue<TValue, TData>(): DynOperation<TValue, TData, DynFormValue<TValue> | undefined> {
  return (context) => context.dynForm.value$;
}

export function currentPlaceholder<TValue, TData>(): DynOperation<TValue, TData, string> {
  return (context) => context.dynForm.placeholder$;
}

export function currentValidators<TValue, TData>(): DynOperation<TValue, TData, any[]> {
  return (context) => context.dynForm.validators$;
}

export function currentData<TValue, TData>(): DynOperation<TValue, TData, TData | undefined> {
  return (context) => context.dynForm.data$;
}



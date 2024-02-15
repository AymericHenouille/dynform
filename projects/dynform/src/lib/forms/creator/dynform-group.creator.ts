import { DynOperable, DynOperation } from '../../models/dyn-operation.model';
import { DynValidator } from '../../models/dyn-validator.model';
import { DynForm, DynformGroup } from '../dynform.model';

export type DynFormGroupCreatorOptions<TValue, TData> = {
  [key in keyof TValue]: DynForm<TValue[key], TData>;
}

export type ChildDynForm<TValue, TData, TKey> = {
  key: TKey;
  form: DynForm<TValue, TData>;
}

export type DynFormGroupOptions<TValue, TData> = {
  children: ChildDynForm<TValue[keyof TValue], TData, keyof TValue>[];
  hide: DynOperation<TValue, TData, boolean>;
  disabled: DynOperation<TValue, TData, boolean>;
  validators: DynOperation<TValue, TData, DynValidator<TValue, TData>[]>;
  data: DynOperation<TValue, TData, DynOperable<TValue, TData, TData>>;
}

export function createDynFormGroup<TValue, TData>(groups: DynFormGroupCreatorOptions<TValue, TData>): DynformGroup<TValue, TData> {
  throw new Error('Not implemented');
}

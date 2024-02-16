import { DynForm, DynformGroup } from '../../models/dyn-form/dynform.model';
import { DynFormOptions } from './dynform.factory';

export type DynFormGroupOptions<TValue, TData> = {
  [key in keyof TValue]: DynForm<TValue[key], TData>;
}

export function createDynFormGroup<TValue, TData>(groups: DynFormGroupOptions<TValue, TData>, options?: DynFormOptions<TValue, TData>): DynformGroup<TValue, TData> {
  throw new Error('Not implemented');
}

import { use, useEmpty } from '../../operators/use.operator';
import { FieldDynForm, FieldDynFormOptions } from '../dynforms/field.dynform';

/**
 * Creates a new instance of FieldDynForm.
 * @param options Options to create a new FieldDynForm instance.
 * @returns A new instance of FieldDynForm.
 */
  export function createFieldDynform<TValue, TData>(options: Partial<FieldDynFormOptions<TValue, TData>> = {}): FieldDynForm<TValue, TData> {
  const fullOptions: FieldDynFormOptions<TValue, TData> = Object.assign({
    value: useEmpty(),
    placeholder: use(''),
    hide: use(false),
    disable: use(false),
    validators: use([]),
    data: useEmpty(),
  }, options);
  return new FieldDynForm<TValue, TData>(fullOptions);
}

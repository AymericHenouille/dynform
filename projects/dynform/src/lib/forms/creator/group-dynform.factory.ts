import { use, useEmpty } from '../../operators/use.operator';
import { GroupDynForm, GroupDynFormOption } from '../dynforms/group.dynform';

/**
 * Creates a new instance of GroupDynForm.
 *
 * @param field The fields of the form.
 * @param options Options to create a new GroupDynForm instance.
 * @returns A new instance of GroupDynForm.
 */
export function createGroupDynform<TValue, TData>(
  fields: Pick<GroupDynFormOption<TValue, TData>, 'fields'>['fields'],
  options: Partial<Pick<GroupDynFormOption<TValue, TData>, 'options'>['options']> = {}
): GroupDynForm<TValue, TData> {
  const fullOptions: Pick<GroupDynFormOption<TValue, TData>, 'options'>['options'] = Object.assign({
    placeholder: use(''),
    hide: use(false),
    disable: use(false),
    validators: use([]),
    data: useEmpty(),
  }, options);
  return new GroupDynForm<TValue, TData>({
    fields,
    options: fullOptions
  });
}

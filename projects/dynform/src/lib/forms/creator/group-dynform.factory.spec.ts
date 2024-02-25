import { EMPTY, firstValueFrom, of } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { DynValidatorError } from '../../models/dynvalidator.model';
import { FieldDynForm, FieldDynFormOptions } from '../dynforms/field.dynform';
import { GroupDynForm } from '../dynforms/group.dynform';
import { createGroupDynform } from './group-dynform.factory';

function createFieldDynform<TValue, TData>(ctxName: string, options: Partial<FieldDynFormOptions<TValue, TData>>): FieldDynForm<TValue, TData> {
  const fullOptions: FieldDynFormOptions<TValue, TData> = Object.assign({
    value: () => EMPTY,
    placeholder: () => of(''),
    hide: () => of(false),
    disable: () => of(false),
    validators: () => of([]),
    data: () => EMPTY,
  }, options);
  const form: FieldDynForm<TValue, TData> = new FieldDynForm<TValue, TData>(fullOptions);
  form.setContext({ name: ctxName, dynForm: form });
  return form;
}

async function applyContext<TValue, TData>(dynForm: GroupDynForm<TValue, TData>, context: DynContext<TValue, TData>): Promise<void> {
  dynForm.setContext(context);
  for (const key of dynForm.keys()) {
    const childForm = dynForm.get(key as keyof TValue);
    await childForm.patchContext({ parent: context });
  }
}

describe('The createGroupDynForm function', () => {
  it('should create a new GroupDynForm instance with default options', async () => {
    type User = { name: string; age: number; };
    const groupDynForm: GroupDynForm<User, {}> = createGroupDynform<User, {}>({
      name: createFieldDynform('name', {}),
      age: createFieldDynform('age', {}),
    });
    await applyContext(groupDynForm, {
      name: 'root',
      dynForm: groupDynForm,
    });
    const hide: boolean = await firstValueFrom(groupDynForm.hide$);
    const disabled: boolean = await firstValueFrom(groupDynForm.disable$);
    const validators: DynValidatorError[] = await firstValueFrom(groupDynForm.validatorsErrors$);

    expect(hide).toBeFalse();
    expect(disabled).toBeFalse();
    expect(validators).toEqual([]);
  });

  it('should create a new GroupDynForm instance and override the default options', async () => {
    type User = { name: string; age: number; };
    const groupDynForm: GroupDynForm<User, { data: string }> = createGroupDynform<User, { data: string }>({
      name: createFieldDynform('name', {}),
      age: createFieldDynform('age', {}),
    },
    {
      hide: () => of(true),
      disable: () => of(true),
      validators: () => of([
        () => of({ message: 'test' })
      ]),
      data: () => of({ data: () => of('test') }),
    });
    await applyContext(groupDynForm, {
      name: 'root',
      dynForm: groupDynForm,
    });

    const hide: boolean = await firstValueFrom(groupDynForm.hide$);
    const disabled: boolean = await firstValueFrom(groupDynForm.disable$);
    const validators: DynValidatorError[] = await firstValueFrom(groupDynForm.validatorsErrors$);
    const data: { data: string } = await firstValueFrom(groupDynForm.data$);

    expect(hide).toBeTrue();
    expect(disabled).toBeTrue();
    expect(validators).toEqual([{ message: 'test' }]);
    expect(data).toEqual({ data: 'test' });
  });
});

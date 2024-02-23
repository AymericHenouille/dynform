import { firstValueFrom } from 'rxjs';
import { DynValidatorError } from '../../models/dynvalidator.model';
import { DynFormValue } from '../../models/value.model';
import { use } from '../../operators/use.operator';
import { FieldDynForm } from '../dynforms/field.dynform';
import { createFieldDynform } from './field-dynform.factory';

describe('The createFieldDynform function', () => {
  it('should create a new FieldDynForm instance with default options', async () => {
    const form: FieldDynForm<string, {}> = createFieldDynform();
    form.setContext({} as any);
    expect(form).toBeInstanceOf(FieldDynForm);

    const hide: boolean = await firstValueFrom(form.hide$);
    const disabled: boolean = await firstValueFrom(form.disable$);
    const placeholder: string = await firstValueFrom(form.placeholder$);
    const validators: DynValidatorError[] = await firstValueFrom(form.validatorsErrors$);

    expect(hide).toBeFalse();
    expect(disabled).toBeFalse();
    expect(placeholder).toBe('');
    expect(validators).toEqual([]);
  });

  it('should create a new FieldDynForm instance and override the default options', async () => {
    const form: FieldDynForm<string, { data: string }> = createFieldDynform({
      hide: use(true),
      disable: use(true),
      placeholder: use('placeholder'),
      validators: use([
        use({ message: 'test' })
      ]),
      data: use({ data: use('test') }),
      value: use({ value: 'test' }),
    });
    form.setContext({} as any);
    expect(form).toBeInstanceOf(FieldDynForm);

    const hide: boolean = await firstValueFrom(form.hide$);
    const disabled: boolean = await firstValueFrom(form.disable$);
    const placeholder: string = await firstValueFrom(form.placeholder$);
    const validators: DynValidatorError[] = await firstValueFrom(form.validatorsErrors$);
    const value: DynFormValue<string> = await firstValueFrom(form.value$);
    const data: { data: string } = await firstValueFrom(form.data$);

    expect(hide).toBeTrue();
    expect(disabled).toBeTrue();
    expect(placeholder).toBe('placeholder');
    expect(validators).toEqual([{ message: 'test' }]);
    expect(value).toEqual({ value: 'test' });
    expect(data).toEqual({ data: 'test' });
  });
});

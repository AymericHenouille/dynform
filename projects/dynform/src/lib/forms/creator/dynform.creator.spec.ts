import { ValidationErrors } from '@angular/forms';
import { Observer, firstValueFrom, of, skip } from 'rxjs';
import { DynValidatorError } from '../../models/dyn-validator.model';
import { DynFormValue } from '../../models/value.model';
import { FieldDynForm } from '../field.dynform';
import { createDynForm } from './dynform.creator';

describe('The createDynForm function', () => {
  it('should create a new DynForm instance with default options', async () => {
    const dynForm: FieldDynForm<string, {}> = createDynForm();
    dynForm.setContext({ name: 'test', dynForm });
    const hide: boolean = await firstValueFrom(dynForm.hidden$);
    const disabled: boolean = await firstValueFrom(dynForm.disable$);
    const value: DynFormValue<string> | undefined = await firstValueFrom(dynForm.value$);
    const placeholder: string = await firstValueFrom(dynForm.placeholder$);
    const validators: DynValidatorError[] = await firstValueFrom(dynForm.validatorsErrors$);
    expect(hide).toBeFalse();
    expect(disabled).toBeFalse();
    expect(value).toBeUndefined();
    expect(placeholder).toBe('');
    expect(validators).toEqual([]);
    const oberserver: Observer<{}> = jasmine.createSpyObj<Observer<{}>>('Observer', ['next', 'error', 'complete']);
    dynForm.data$.subscribe(oberserver);
    expect(oberserver.next).not.toHaveBeenCalled();
    expect(oberserver.error).not.toHaveBeenCalled();
    expect(oberserver.complete).not.toHaveBeenCalled();
  });

  it('should create a new DynForm instance and override the default options', async () => {
    const dynForm: FieldDynForm<string, { test: string }> = createDynForm({
      hide: () => of(true),
      disabled: () => of(true),
      value: () => of({ value: 'test' }),
      placeholder: () => of('test'),
      validators: () => of([
        () => of({ message: 'test' }),
      ]),
      data: () => of({
        test: () => of('test'),
      }),
    });
    dynForm.setContext({ name: 'test', dynForm });
    const hide: boolean = await firstValueFrom(dynForm.hidden$);
    const disabled: boolean = await firstValueFrom(dynForm.disable$);
    const value: DynFormValue<string> | undefined = await firstValueFrom(dynForm.value$.pipe(skip(1)));
    const placeholder: string = await firstValueFrom(dynForm.placeholder$);
    const validators: ValidationErrors[] = await firstValueFrom(dynForm.validatorsErrors$);
    const data: Partial<{ test: string }> = await firstValueFrom(dynForm.data$);
    expect(hide).toBeTrue();
    expect(disabled).toBeTrue();
    expect(value).toEqual({ value: 'test' });
    expect(placeholder).toBe('test');
    expect(validators).toEqual([{ message: 'test' }]);
    expect(data).toEqual({ test: 'test' });
  });

});

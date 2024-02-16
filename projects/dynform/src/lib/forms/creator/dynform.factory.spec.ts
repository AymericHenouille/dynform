// import { firstValueFrom, of, skip } from 'rxjs';
// import { DynForm } from '../../models/dyn-form/dynform.model';
// import { DynValidator } from '../../models/dyn-validator.model';
// import { DynFormValue } from '../../models/value.model';
// import { createDynForm } from './dynform.factory';

// describe('The createDynForm function', () => {

//   it('should create a new DynForm instance with default options', async () => {
//     const dynForm: DynForm<string> = createDynForm();
//     dynForm.setContext({ name: 'test', dynForm });
//     const hide: boolean = await firstValueFrom(dynForm.hidden$);
//     const disabled: boolean = await firstValueFrom(dynForm.disable$);
//     const value: DynFormValue<string> | undefined = await firstValueFrom(dynForm.value$);
//     const placeholder: string = await firstValueFrom(dynForm.placeholder$);
//     const validators: DynValidator<string, {}>[] = await firstValueFrom(dynForm.validators$);
//     const data: {} = await firstValueFrom(dynForm.data$);
//     expect(hide).toBeFalse();
//     expect(disabled).toBeFalse();
//     expect(value).toBeUndefined();
//     expect(placeholder).toBe('');
//     expect(validators).toEqual([]);
//     expect(data).toEqual({})
//   });

//   it('should create a new DynForm instance and override the default options', async () => {
//     const dynForm: DynForm<string, { test: string }> = createDynForm({
//       hide: () => of(true),
//       disabled: () => of(true),
//       value: () => of({ value: 'test' }),
//       placeholder: () => of('test'),
//       validators: () => of([
//         () => of(undefined),
//       ]),
//       data: () => of({
//         test: () => of('test'),
//       }),
//     });
//     dynForm.setContext({ name: 'test', dynForm });
//     const hide: boolean = await firstValueFrom(dynForm.hidden$);
//     const disabled: boolean = await firstValueFrom(dynForm.disable$);
//     const value: DynFormValue<string> | undefined = await firstValueFrom(dynForm.value$.pipe(skip(1)));
//     const placeholder: string = await firstValueFrom(dynForm.placeholder$);
//     const validators: DynValidator<string, { test: string }>[] = await firstValueFrom(dynForm.validators$);
//     const data: Partial<{ test: string }> = await firstValueFrom(dynForm.data$.pipe(skip(1)));
//     expect(hide).toBeTrue();
//     expect(disabled).toBeTrue();
//     expect(value).toEqual({ value: 'test' });
//     expect(placeholder).toBe('test');
//     expect(validators.length).toBe(1);
//     expect(data).toEqual({ test: 'test' });
//   });

// });

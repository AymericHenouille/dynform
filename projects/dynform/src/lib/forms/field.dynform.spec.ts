import { Observable, Subject, firstValueFrom, of, skip, take } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { DynValidatorError } from '../models/dyn-validator.model';
import { DynFormValue } from '../models/value.model';
import { DynFormOptions } from './creator/dynform.creator';
import { DynFormContext } from './dynform-context.model';
import { FieldDynForm } from './field.dynform';

function createOptions<TValue, TData>(options: Partial<DynFormOptions<TValue, TData>>): DynFormOptions<TValue, TData> {
  return Object.assign({
    value: (context: DynFormContext<TValue, TData>) => of(''),
    data: (context: DynFormContext<TValue, TData>) => of({}),
    disabled: (context: DynFormContext<TValue, TData>) => of(false),
    hide: (context: DynFormContext<TValue, TData>) => of(false),
    validators: (context: DynFormContext<TValue, TData>) => of([]),
    placeholder: (context: DynFormContext<TValue, TData>) => of(''),
  }, options);
}

describe('The FieldDynForm', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => testScheduler = new TestScheduler((actual, expected) => {
    return expect(actual).toEqual(expected);
  }));

  describe('with a custom options', () => {

    it('should emit new hide value', (done) => {
      testScheduler.run(({ expectObservable, cold }) => {
        const marble: string = '             tfttf';
        const espectMarble: string =        'tfttf';
        const expectMarbleReverse: string = 'ftfft';
        const value: { [key: string]: boolean } = {
          t: true,
          f: false,
        };
        const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
          hide: () => cold<boolean>(marble, value),
        }));
        field.setContext({ name: 'root', dynForm: field });
        const hide$:    Observable<boolean> = field.hidden$;
        const visible$: Observable<boolean> = field.visible$;
        expectObservable(hide$).toBe(espectMarble, value);
        expectObservable(visible$).toBe(expectMarbleReverse, value);
        done();
      });
    });

    it('should emit new disabled value', (done) => {
      testScheduler.run(({ expectObservable, cold }) => {
        const marble: string = '             tfttf';
        const espectMarble: string = '       tfttf';
        const espectMarbleReverse: string = 'ftfft';
        const value: { [key: string]: boolean } = {
          t: true,
          f: false,
        };
        const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
          disabled: () => cold<boolean>(marble, value),
        }));
        field.setContext({ name: 'root', dynForm: field });
        const disabled$: Observable<boolean> = field.disable$;
        const enabled$: Observable<boolean> = field.enable$;
        expectObservable(disabled$).toBe(espectMarble, value);
        expectObservable(enabled$).toBe(espectMarbleReverse, value);
        done();
      });
    });

    it('should emit new value', (done) => {
      testScheduler.run(({ expectObservable, cold }) => {
        const marble: string = '      -abc';
        const espectMarble: string = 'uabc';
        const value: { [key: string]: DynFormValue<string> } = {
          a: { value: 'benoit' },
          b: { value: 'is a' },
          c: { value: 'dream' },
        };
        const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
          value: () => cold<DynFormValue<string>>(marble, value),
        }));
        field.setContext({ name: 'root', dynForm: field });
        const value$: Observable<DynFormValue<string> | undefined> = field.value$;
        expectObservable(value$).toBe(espectMarble, { ...value, u: undefined });
        done();
      });
    });

    it('should emit new placeholder', (done) => {
      testScheduler.run(({ expectObservable, cold }) => {
        const marble: string = '      abc';
        const espectMarble: string = 'abc';
        const value: { [key: string]: string } = {
          a: 'benoit',
          b: 'is a',
          c: 'dream',
        };
        const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
          placeholder: () => cold<string>(marble, value),
        }));
        field.setContext({ name: 'root', dynForm: field });
        const placeholder$: Observable<string> = field.placeholder$;
        expectObservable(placeholder$).toBe(espectMarble, { ...value, u: '' });
        done();
      });
    });

    it('should emit new validators', (done) => {
      testScheduler.run(({ expectObservable, cold }) => {
        const marbleValidator1: string = '    -f-tf-tt-t';
        const marbleValidator2: string = '    --t--f--t';
        const marbleValidateEspect: string = 't-ftfffftt';
        const marbleInvalidEspect: string =  'f-tfttttff';

        const errorValues: { [key: string]: DynValidatorError | undefined } = { t: undefined, f: { message: 'error' } };
        const validValues: { [key: string]: boolean } = { t: true, f: false };

        const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
          validators: () => of([
            () => cold<DynValidatorError | undefined>(marbleValidator1, errorValues),
            () => cold<DynValidatorError | undefined>(marbleValidator2, errorValues),
          ]),
        }));
        field.setContext({ name: 'root', dynForm: field });

        const valid$: Observable<boolean> = field.valid$;
        const invalid$: Observable<boolean> = field.invalid$;
        expectObservable(valid$).toBe(marbleValidateEspect, validValues);
        expectObservable(invalid$).toBe(marbleInvalidEspect, validValues);
        done();
      });
    });

    it('should emit new data', (done) => {
      type Data = { name: string, age: number };
      const name$$: Subject<string> = new Subject();
      const age$$: Subject<number> = new Subject();
      const field: FieldDynForm<string, Data> = new FieldDynForm(createOptions({
        data: () => of({
          name: () => name$$.asObservable(),
          age: () => age$$.asObservable(),
        })
      }));
      field.setContext({ name: 'root', dynForm: field });
      let index = 0
      field.data$.pipe(take(7)).subscribe((result) => {
        switch(index++) {
          case 0: expect(result).toEqual({ name: undefined                  }); break;
          case 1: expect(result).toEqual({ name: undefined,  age: undefined }); break;
          case 2: expect(result).toEqual({ name: 'benoit',   age: undefined }); break;
          case 3: expect(result).toEqual({ name: 'benoit',   age: 1         }); break;
          case 4: expect(result).toEqual({ name: 'benoit',   age: 2         }); break;
          case 5: expect(result).toEqual({ name: 'geoffrey', age: 2         }); break;
          case 6: expect(result).toEqual({ name: 'geoffrey', age: 3         }); done(); break;
        }
      })
      name$$.next('benoit');
      age$$.next(1);
      age$$.next(2);
      name$$.next('geoffrey');
      age$$.next(3);
    });

  });

  describe('when editing the input value', () => {

    it('should emit new value', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const value$: Observable<DynFormValue<string> | undefined> = field.value$;
      const value: { [key: string]: DynFormValue<string> } = {
        a: { value: 'benoit'   },
        b: { value: 'geoffrey' },
        c: { value: 'aymeric'  },
        d: { value: 'ugo'      },
        e: { value: ''         },
      };

      const result1: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result1).toBeUndefined();

      field.writeValue(value['a']);
      const result2: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result2).toEqual(value['a']);

      field.writeValue(value['b']);
      const result3: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result3).toEqual(value['b']);

      field.writeValue(value['c']);
      const result4: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result4).toEqual(value['c']);

      field.writeValue(value['d']);
      const result5: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result5).toEqual(value['d']);
    });

    it('should update new value', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const value$: Observable<DynFormValue<string> | undefined> = field.value$;

      const result1: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result1).toBeUndefined();

      field.writeValue({ value: 'benoit' });
      const result2: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result2).toEqual({ value: 'benoit' });

      await field.updateValue((value) => ({ value: (value?.value ?? '').toUpperCase() }));
      const result3: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result3).toEqual({ value: 'BENOIT' });
    });

    it('should update value with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const value$: Observable<DynFormValue<string> | undefined> = field.value$;

      const result1: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result1).toBeUndefined();

      field.writeValue({ value: 'benoit' });
      const result2: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result2).toEqual({ value: 'benoit' });

      await field.updateValue((value) => Promise.resolve(({ value: (value?.value ?? '').toUpperCase() })));
      const result3: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result3).toEqual({ value: 'BENOIT' });
    });

    it('should update value with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const value$: Observable<DynFormValue<string> | undefined> = field.value$;

      const result1: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result1).toBeUndefined();

      field.writeValue({ value: 'benoit' });
      const result2: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result2).toEqual({ value: 'benoit' });

      await field.updateValue((value) => of(({ value: (value?.value ?? '').toUpperCase() })));
      const result3: DynFormValue<string> | undefined = await firstValueFrom(value$);
      expect(result3).toEqual({ value: 'BENOIT' });
    });

    it('should patch new value', async () => {
      type Value = { value: string, age: number };
      const field: FieldDynForm<Value, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const value$: Observable<DynFormValue<Value> | undefined> = field.value$;

      const result1: DynFormValue<Value> | undefined = await firstValueFrom(value$);
      expect(result1).toBeUndefined();

      await field.patchValue({ value: { value: 'benoit', age: 1 } });
      const result2: DynFormValue<Value> | undefined = await firstValueFrom(value$);
      expect(result2).toEqual({ value: { value: 'benoit', age: 1 } });

      await field.patchValue({ value: { value: 'Geoffrey' } });
      const result3: DynFormValue<Value> | undefined = await firstValueFrom(value$);
      expect(result3).toEqual({ value: { value: 'Geoffrey', age: 1 } });

      await field.patchValue({ value: { age: 2 } });
      const result4: DynFormValue<Value> | undefined = await firstValueFrom(value$);
      expect(result4).toEqual({ value: { value: 'Geoffrey', age: 2 } });
    });

    it('should take the last value between the options and the input', (done) => {
      const valueOptions$$: Subject<DynFormValue<string>> = new Subject();
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        value: () => valueOptions$$.asObservable(),
      }));
      field.setContext({ name: 'root', dynForm: field });
      const value$: Observable<DynFormValue<string> | undefined> = field.value$;
      let index = 0;
      value$.subscribe((value) => {
        switch (index) {
          case 0: expect(value).toBeUndefined(); break;
          case 1: expect(value).toEqual({ value: 'benoit' }); break;
          case 2: expect(value).toEqual({ value: 'Geoffrey' }); break;
          case 3: expect(value).toEqual({ value: 'Aymeric' }); break;
          case 4: expect(value).toEqual({ value: 'Ugo' }); break;
          case 5: expect(value).toEqual({ value: 'Ugo with no H' }); done(); break;
          default: fail('should not have more than 5 values');
        }
        index++;
      });

      field.writeValue({ value: 'benoit' });
      valueOptions$$.next({ value: 'Geoffrey' });
      field.writeValue({ value: 'Aymeric' });
      valueOptions$$.next({ value: 'Ugo' });
      field.writeValue({ value: 'Ugo with no H' });
    });

  });

  describe('when editing the input data', () => {
    it('should emit new data', async () => {
      type Data = { name: string, age: number };
      const field: FieldDynForm<string, Data> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const data$: Observable<Partial<Data>> = field.data$;
      const value: { [key: string]: Data } = {
        a: { name: 'benoit',   age: 1 },
        b: { name: 'geoffrey', age: 1 },
        c: { name: 'aymeric',  age: 1 },
        d: { name: 'ugo',      age: 1 },
      };

      field.setData(value['a']);
      const result2: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result2).toEqual(value['a']);

      field.setData(value['b']);
      const result3: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result3).toEqual(value['b']);

      field.setData(value['c']);
      const result4: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result4).toEqual(value['c']);

      field.setData(value['d']);
      const result5: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result5).toEqual(value['d']);
    });

    it('should update new data', async () => {
      type Data = { name: string, age: number };
      const field: FieldDynForm<string, Data> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const data$: Observable<Partial<Data>> = field.data$;

      field.setData({ name: 'benoit', age: 1 });
      const result2: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result2).toEqual({ name: 'benoit', age: 1 });

      await field.updateData((data) => ({ name: (data?.name ?? '').toUpperCase(), age: 0 }));
      const result3: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result3).toEqual({ name: 'BENOIT', age: 0 });
    });

    it('should update data with promise', async () => {
      type Data = { name: string, age: number };
      const field: FieldDynForm<string, Data> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const data$: Observable<Partial<Data>> = field.data$;

      field.setData({ name: 'benoit', age: 1 });
      const result2: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result2).toEqual({ name: 'benoit', age: 1 });

      await field.updateData((data) => Promise.resolve(({ name: (data?.name ?? '').toUpperCase(), age: 0 })));
      const result3: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result3).toEqual({ name: 'BENOIT', age: 0 });
    });

    it('should update data with observable', async () => {
      type Data = { name: string, age: number };
      const field: FieldDynForm<string, Data> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const data$: Observable<Partial<Data>> = field.data$;

      field.setData({ name: 'benoit', age: 1 });
      const result2: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result2).toEqual({ name: 'benoit', age: 1 });

      await field.updateData((data) => of(({ name: (data?.name ?? '').toUpperCase(), age: 0 })));
      const result3: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result3).toEqual({ name: 'BENOIT', age: 0 });
    });

    it('should patch new data', async () => {
      type Data = { name: string, age: number };
      const field: FieldDynForm<string, Data> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const data$: Observable<Partial<Data>> = field.data$;

      field.setData({ name: 'benoit', age: 1 });
      const result2: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result2).toEqual({ name: 'benoit', age: 1 });

      await field.patchData({ name: 'Geoffrey' });
      const result3: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result3).toEqual({ name: 'Geoffrey', age: 1 });

      await field.patchData({ age: 2 });
      const result4: Partial<Data> = await firstValueFrom(data$.pipe(skip(1)));
      expect(result4).toEqual({ name: 'Geoffrey', age: 2 });
    });

  });

  describe('when editing the input enable', () => {

    it('should be enable by default', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeTrue();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeFalse();
    });

    it('should set the new enable status', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setEnableState(false);
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    });

    it('should set the new disable status', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setDisableState(true);
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    });

    it('should enable the form', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        disabled: () => of(true)
      }));
      field.setContext({ name: 'root', dynForm: field });
      let enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      let disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();

      field.enable();

      enabled = await firstValueFrom(field.enable$);
      expect(enabled).toBeTrue();
      disabled = await firstValueFrom(field.disable$);
      expect(disabled).toBeFalse();
    });

    it('should disable the form', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        disabled: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      let enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeTrue();
      let disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeFalse();

      field.disable();

      enabled = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      disabled = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    })

    it('should update enable state', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateEnableState((old) => !old);
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    });

    it('should update enable state with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateEnableState((old) => Promise.resolve(!old));
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    });

    it('should update enable state with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateEnableState((old) => of(!old));
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    });

    it('should update disabled state', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateDisableState((old) => !old);
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    });

    it('should update disabled state with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateDisableState((old) => Promise.resolve(!old));
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    });

    it('should update disabled state with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateDisableState((old) => of(!old));
      const enabled: boolean = await firstValueFrom(field.enable$);
      expect(enabled).toBeFalse();
      const disabled: boolean = await firstValueFrom(field.disable$);
      expect(disabled).toBeTrue();
    });

    it('should update enable state between the options and the input', (done) => {
      const disabled$$: Subject<boolean> = new Subject();
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        disabled: () => disabled$$.asObservable(),
      }));
      field.setContext({ name: 'root', dynForm: field });
      let index = 0;
      field.enable$.subscribe((enabled) => {
        switch (index) {
          case 0: expect(enabled).toBeFalse(); break;
          case 1: expect(enabled).toBeTrue(); done(); break;
          default: fail('should not have more than 2 values');
        }
        index++;
      });

      field.setEnableState(false);
      disabled$$.next(false);
    });
  });

  describe('when editing the touch status', () => {
    it('should be untouched by default', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeFalse();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeTrue();
    });

    it('should set the new touched status', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setTouchedState(true);
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeTrue();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeFalse();
    });

    it('should set the new untouched status', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setTouchedState(true);
      field.setUntouchedState(true);
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeFalse();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeTrue();
    });

    it('should update touched state', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateTouchedState((old) => !old);
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeTrue();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeFalse();
    });

    it('should update touched state with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateTouchedState((old) => Promise.resolve(!old));
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeTrue();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeFalse();
    });

    it('should update touched state with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateTouchedState((old) => of(!old));
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeTrue();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeFalse();
    });

    it('should update untouched state', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setTouchedState(true);
      await field.updateUntouchedState((old) => !old);
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeFalse();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeTrue();
    });

    it('should update untouched state with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setTouchedState(true);
      await field.updateUntouchedState((old) => Promise.resolve(!old));
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeFalse();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeTrue();
    });

    it('should update untouched state with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setTouchedState(true);
      await field.updateUntouchedState((old) => of(!old));
      const touched: boolean = await firstValueFrom(field.touched$);
      expect(touched).toBeFalse();
      const untouched: boolean = await firstValueFrom(field.untouched$);
      expect(untouched).toBeTrue();
    });
  });

  describe('when editing the dirty status', () => {
    it('should be pristine by default', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeFalse();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeTrue();
    });

    it('should set the new dirty status', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setDirtyState(true);
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeTrue();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeFalse();
    });

    it('should set the new pristine status', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setDirtyState(true);
      field.setPristineState(true);
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeFalse();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeTrue();
    });

    it('should update dirty state', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateDirtyState((old) => !old);
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeTrue();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeFalse();
    });

    it('should update dirty state with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateDirtyState((old) => Promise.resolve(!old));
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeTrue();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeFalse();
    });

    it('should update dirty state with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateDirtyState((old) => of(!old));
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeTrue();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeFalse();
    });

    it('should update pristine state', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setDirtyState(true);
      await field.updatePristineState((old) => !old);
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeFalse();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeTrue();
    });

    it('should update pristine state with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setDirtyState(true);
      await field.updatePristineState((old) => Promise.resolve(!old));
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeFalse();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeTrue();
    });

    it('should update pristine state with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setDirtyState(true);
      await field.updatePristineState((old) => of(!old));
      const dirty: boolean = await firstValueFrom(field.dirty$);
      expect(dirty).toBeFalse();
      const pristine: boolean = await firstValueFrom(field.pristine$);
      expect(pristine).toBeTrue();
    });
  });

  describe('when editing the visible status', () => {
    it('should be visible by default', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeTrue();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeFalse();
    });

    it('should be visible with options', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(true),
      }));
      field.setContext({ name: 'root', dynForm: field });
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should be hidden with options', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeTrue();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeFalse();
    });

    it('should set the new visible status', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(true),
      }));
      field.setContext({ name: 'root', dynForm: field });
      field.setVisible(true);
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeTrue();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeFalse();
    });

    it('should set the new hidden status', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setHidden(true);
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should update visible state', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateVisible((old) => !old);
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should update visible state with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateVisible((old) => Promise.resolve(!old));
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should update visible state with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateVisible((old) => of(!old));
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should update hidden state', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateHidden((old) => !old);
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should update hidden state with promise', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateHidden((old) => Promise.resolve(!old));
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should update hidden state with observable', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      await field.updateHidden((old) => of(!old));
      const visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      const hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should hide the form', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(false),
      }));
      field.setContext({ name: 'root', dynForm: field });
      let visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeTrue();
      let hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeFalse();

      field.hide();

      visible = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      hidden = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();
    });

    it('should show the form', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({
        hide: () => of(true),
      }));
      field.setContext({ name: 'root', dynForm: field });
      let visible: boolean = await firstValueFrom(field.visible$);
      expect(visible).toBeFalse();
      let hidden: boolean = await firstValueFrom(field.hidden$);
      expect(hidden).toBeTrue();

      field.show();

      visible = await firstValueFrom(field.visible$);
      expect(visible).toBeTrue();
      hidden = await firstValueFrom(field.hidden$);
      expect(hidden).toBeFalse();
    });
  });

  describe('when editing the placeholder', () => {
    it('should be empty by default', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      const placeholder: string = await firstValueFrom(field.placeholder$);
      expect(placeholder).toBe('');
    });

    it('should set the new placeholder', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      field.setPlaceholder('new placeholder');
      const placeholder: string = await firstValueFrom(field.placeholder$);
      expect(placeholder).toBe('new placeholder');
    });

    it('should update placeholder', async () => {
      const field: FieldDynForm<string, {}> = new FieldDynForm(createOptions({}));
      field.setContext({ name: 'root', dynForm: field });
      await field.updatePlaceholder((old) => `${old} updated`);
      const placeholder: string = await firstValueFrom(field.placeholder$);
      expect(placeholder).toBe(' updated');
    });
  });
});

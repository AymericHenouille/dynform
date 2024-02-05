import { Observable, from, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { DynFormValue } from '../models/value.model';
import { DynFormOptions } from './creator/dynform.creator';
import { FieldDynForm } from './field.dynform';

describe('The FieldDynForm', () => {

  let testScheduler: TestScheduler;

  beforeEach(() => testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected)));

  describe('with a config', () => {

    it('should update the value', (done) => {
      const options: DynFormOptions<string, {}> = {
        value: (context) => from([
          { value: 'I' },
          { value: 'am' },
          { value: 'benoit' }
        ]),
        data: (context) => of({}),
        disabled: (context) => of(false),
        hide: (context) => of(false),
        validators: (context) => of([]),
        placeholder: (context) => of(''),
      };
      const field: FieldDynForm<string, {}> = new FieldDynForm(options);
      field.setContext({ name: 'root', dynForm: field });
      const espectMarble = '(zabc)';
      const espectValues = {
        z: undefined,
        a: { value: 'I' },
        b: { value: 'am' },
        c: { value: 'benoit' }
      };
      const value$: Observable<DynFormValue<string> | undefined> = field.value$;
      testScheduler.run(({ expectObservable }) => {
        expectObservable(value$).toBe(espectMarble, espectValues);
        done();
      });
    });

    it('should update the data', (done) => {
      const options: DynFormOptions<string, { value: string }> = {
        value: (context) => of({ value: 'I' }),
        data: (context) => from([
          { value: () => of('benoit') },
          { value: () => of('is a dream') }
        ]),
        disabled: (context) => of(false),
        hide: (context) => of(false),
        validators: (context) => of([]),
        placeholder: (context) => of(''),
      };
      const field: FieldDynForm<string, { value: string }> = new FieldDynForm(options);
      field.setContext({ name: 'root', dynForm: field });
      const espectMarble = '(zab)';
      const espectValues = {
        z: undefined,
        a: { value: 'benoit' },
        b: { value: 'is a dream' },
      };
      const data$: Observable<{ value: string } | undefined> = field.data$;
      testScheduler.run(({ expectObservable }) => {
        expectObservable(data$).toBe(espectMarble, espectValues);
        done();
      });
    });

  });
});

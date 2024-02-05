import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
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

  beforeEach(() => testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected)));

  describe('when manipulate value', () => {

    it('should update the value with options', (done) => {
      testScheduler.run(({ expectObservable, cold }) => {
        const marble: string = '--a-b-c';
        const espectMarble: string = 'u-a-b-c';
        const value: { [key: string]: DynFormValue<string> } = {
          a: { value: 'benoit' },
          b: { value: 'is a' },
          c: { value: 'dream' },
        };
        const espectedValue: { [key: string]: DynFormValue<string> | undefined } = {
          ...value,
          u: undefined,
        };
        const options: DynFormOptions<string, {}> = createOptions({
          value: (context: DynFormContext<string, {}>) => cold<DynFormValue<string>>(marble, value).pipe(),
        });
        const field: FieldDynForm<string, {}> = new FieldDynForm(options);
        field.setContext({ name: 'root', dynForm: field });
        const value$: Observable<DynFormValue<string> | undefined> = field.value$;
        expectObservable(value$).toBe(espectMarble, espectedValue);
        done();
      });
    });

  });
});

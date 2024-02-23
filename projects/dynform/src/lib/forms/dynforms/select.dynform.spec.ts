import { BehaviorSubject, EMPTY, firstValueFrom } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { DynOperation } from '../../models/dynoperation.model';
import { DynFormValue } from '../../models/value.model';
import { SelectDynForm } from './select.dynform';

describe('The select DynForm', () => {
  describe('options', () => {
    it('should be updated when the options of the select are updated', async () => {
      const options1$$: BehaviorSubject<DynFormValue<string>> = new BehaviorSubject<DynFormValue<string>>({ value: 'benoit' });
      const options2$$: BehaviorSubject<DynFormValue<string>> = new BehaviorSubject<DynFormValue<string>>({ value: 'Geoffrey' });
      const options$$: BehaviorSubject<DynOperation<string, any, DynFormValue<string>>[]> = new BehaviorSubject<DynOperation<string, any, DynFormValue<string>>[]>([]);
      const form: SelectDynForm<string, any> = new SelectDynForm({
        value: () => EMPTY,
        data: () => EMPTY,
        placeholder: () => EMPTY,
        validators: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        options: () => options$$,
      });
      form.setContext({} as DynContext<string, any>);

      const options: DynFormValue<string>[] = await firstValueFrom(form.options$);
      expect(options).toEqual([]);

      options$$.next([() => options1$$, () => options2$$]);
      options1$$.next({ value: 'benoit' });
      options2$$.next({ value: 'Geoffrey' });
      const newOptions: DynFormValue<string>[] = await firstValueFrom(form.options$);
      expect(newOptions).toEqual([
        { value: 'benoit' },
        { value: 'Geoffrey' },
      ]);
    });
  });
});

import { BehaviorSubject, EMPTY, firstValueFrom, of } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { FieldDynForm } from './field.dynform';

describe('The FieldDynForm', () => {
  describe('placeholder', () => {
    it('should be updated when the options value is updated ', async () => {
      const form: FieldDynForm<string, string> = new FieldDynForm<string, string>({
        hide: () => EMPTY,
        value: () => EMPTY,
        placeholder: () => of('benoit', 'geoffrey'),
        data: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
      });
      form.setContext({} as DynContext<string, string>);

      const placeholder: string = await firstValueFrom(form.placeholder$);
      expect(placeholder).toBe('benoit');
      const placeholder2: string = await firstValueFrom(form.placeholder$);
      expect(placeholder2).toBe('geoffrey');
    });

    it('should be updated when the setPlaceholder is called', async () => {
      const form: FieldDynForm<string, string> = new FieldDynForm<string, string>({
        hide: () => EMPTY,
        value: () => EMPTY,
        placeholder: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
      });
      form.setContext({} as DynContext<string, string>);

      form.setPlaceholder('benoit');
      const placeholder: string = await firstValueFrom(form.placeholder$);
      expect(placeholder).toBe('benoit');
    });

    it('should be updated when the updatePlaceholder is called', async () => {
      const form: FieldDynForm<string, string> = new FieldDynForm<string, string>({
        hide: () => EMPTY,
        value: () => EMPTY,
        placeholder: () => of('benoit'),
        data: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
      });
      form.setContext({} as DynContext<string, string>);

      await form.updatePlaceholder((placeholder) => placeholder.toUpperCase());
      const placeholder: string = await firstValueFrom(form.placeholder$);
      expect(placeholder).toBe('BENOIT');
    });

    it('should be updated when the updatePlaceholder is called with Promise ', async () => {
      const form: FieldDynForm<string, string> = new FieldDynForm<string, string>({
        hide: () => EMPTY,
        value: () => EMPTY,
        placeholder: () => of('benoit'),
        data: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
      });
      form.setContext({} as DynContext<string, string>);

      await form.updatePlaceholder((placeholder) => Promise.resolve(placeholder.toUpperCase()));
      const placeholder: string = await firstValueFrom(form.placeholder$);
      expect(placeholder).toBe('BENOIT');
    });

    it('should be updated when the updatePlaceholder is called with Observable ', async () => {
      const form: FieldDynForm<string, string> = new FieldDynForm<string, string>({
        hide: () => EMPTY,
        value: () => EMPTY,
        placeholder: () => of('benoit'),
        data: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
      });
      form.setContext({} as DynContext<string, string>);

      await form.updatePlaceholder((placeholder) => of(placeholder.toUpperCase()));
      const placeholder: string = await firstValueFrom(form.placeholder$);
      expect(placeholder).toBe('BENOIT');
    });

    it('should be updated when the updatePlaceholder is called with setPlaceholder and subject', async () => {
      const placeholder$$: BehaviorSubject<string> = new BehaviorSubject<string>('');
      const form: FieldDynForm<string, string> = new FieldDynForm<string, string>({
        hide: () => EMPTY,
        value: () => EMPTY,
        placeholder: () => placeholder$$.asObservable(),
        data: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
      });
      form.setContext({} as DynContext<string, string>);

      form.setPlaceholder('benoit');
      const placeholder: string = await firstValueFrom(form.placeholder$);
      expect(placeholder).toBe('benoit');

      placeholder$$.next('geoffrey');
      const placeholder2: string = await firstValueFrom(form.placeholder$);
      expect(placeholder2).toBe('geoffrey');
    });
  });
});

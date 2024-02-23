import { BehaviorSubject, EMPTY, firstValueFrom, of } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { DynOperation } from '../../models/dynoperation.model';
import { DynValidatorError } from '../../models/dynvalidator.model';
import { DynFormValue } from '../../models/value.model';
import { EditableDynForm } from './editable.dynform';

describe('The EditableDynForm', () => {
  describe('value attribute', () => {
    it('should be updated when the options value is updated', async () => {
      type Value = string;
      const form: EditableDynForm<Value, {}> = new EditableDynForm<Value, {}>({
        value: () => of({ value: 'value' }, { value: 'value2' }),
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<Value, {}>);
      const value: DynFormValue<Value> = await firstValueFrom(form.value$);
      expect(value).toEqual({ value: 'value' });
      const value2: DynFormValue<Value> = await firstValueFrom(form.value$);
      expect(value2).toEqual({ value: 'value2' });
    });

    it('should be updated with the writeValue method', async () => {
      type Value = string;
      const form: EditableDynForm<Value, {}> = new EditableDynForm<Value, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<Value, {}>);
      form.writeValue({ value: 'value' });
      const value2: DynFormValue<Value> = await firstValueFrom(form.value$);
      expect(value2).toEqual({ value: 'value' });
    });

    it('should be updated with the updateValue method', async () => {
      type Value = string;
      const form: EditableDynForm<Value, {}> = new EditableDynForm<Value, {}>({
        value: () => of({ value: 'Benoit' }),
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<Value, {}>);
      await form.updateValue(({value}) => ({ value: value + ' Bankaert' }));
      const value2: DynFormValue<Value> = await firstValueFrom(form.value$);
      expect(value2).toEqual({ value: 'Benoit Bankaert' });
    });

    it('should be updated with the updateValue method returning a promise', async () => {
      type Value = string;
      const form: EditableDynForm<Value, {}> = new EditableDynForm<Value, {}>({
        value: () => of({ value: 'Benoit' }),
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<Value, {}>);
      await form.updateValue(({value}) => Promise.resolve({ value: value + ' Bankaert' }));
      const value2: DynFormValue<Value> = await firstValueFrom(form.value$);
      expect(value2).toEqual({ value: 'Benoit Bankaert' });
    });

    it('should be updated with the updateValue method returning an observable', async () => {
      type Value = string;
      const form: EditableDynForm<Value, {}> = new EditableDynForm<Value, {}>({
        value: () => of({ value: 'Benoit' }),
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<Value, {}>);
      await form.updateValue(({value}) => of({ value: value + ' Bankaert' }));
      const value2: DynFormValue<Value> = await firstValueFrom(form.value$);
      expect(value2).toEqual({ value: 'Benoit Bankaert' });
    });

    it('should be updated with the patchValue method', async () => {
      type Value = { name: string, age: number };
      const form: EditableDynForm<Value, {}> = new EditableDynForm<Value, {}>({
        value: () => of({ value: { name: 'Benoit', age: 30 } }),
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<Value, {}>);
      await form.patchValue({ value: { name: 'Benoit Bankaert' } });
      const value2: DynFormValue<Value> = await firstValueFrom(form.value$);
      expect(value2).toEqual({ value: { name: 'Benoit Bankaert', age: 30 } });
    });

    it('should emit value with the options and subject', async () => {
      const value$$: BehaviorSubject<{ value: string }> = new BehaviorSubject<{ value: string }>({ value: 'fart' });
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => value$$.asObservable(),
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);

      value$$.next({ value: 'Benoit' });
      const value: DynFormValue<string> = await firstValueFrom(form.value$);
      expect(value).toEqual({ value: 'Benoit' });

      form.writeValue({ value: 'Benoit Bankaert' });
      const value2: DynFormValue<string> = await firstValueFrom(form.value$);
      expect(value2).toEqual({ value: 'Benoit Bankaert' });
    });
  });

  describe('hide attribute', () => {
    it('should be updated when the options hide is updated', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(true, false),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      const hide: boolean = await firstValueFrom(form.hide$);
      expect(hide).toBeTrue();
      const hide2: boolean = await firstValueFrom(form.hide$);
      expect(hide2).toBeFalse();
    });

    it('should be updated with the hide method', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(false),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      form.hide();
      const hide: boolean = await firstValueFrom(form.hide$);
      expect(hide).toBeTrue();
    });

    it('should be updated with the updateHide method', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(false),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateHideState((hide) => !hide);
      const hide: boolean = await firstValueFrom(form.hide$);
      expect(hide).toBeTrue();
    });

    it('should be updated with the updateHide method returning a promise', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(false),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateHideState((hide) => Promise.resolve(!hide));
      const hide: boolean = await firstValueFrom(form.hide$);
      expect(hide).toBeTrue();
    });

    it('should be updated with the updateHide method returning an observable', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(false),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateHideState((hide) => of(!hide));
      const hide: boolean = await firstValueFrom(form.hide$);
      expect(hide).toBeTrue();
    });

    it('should emit hide with the options and subject', async () => {
      const hide$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => hide$$.asObservable(),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);

      hide$$.next(true);
      const hide: boolean = await firstValueFrom(form.hide$);
      expect(hide).toBeTrue();

      form.hide();
      const hide2: boolean = await firstValueFrom(form.hide$);
      expect(hide2).toBeTrue();
    });
  });

  describe('visible attribute', () => {
    it('should be updated when the options hide is updated', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(true, false),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      const visible: boolean = await firstValueFrom(form.visible$);
      expect(visible).toBeFalse();
      const visible2: boolean = await firstValueFrom(form.visible$);
      expect(visible2).toBeTrue();
    });

    it('should be updated with the show method', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(true),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      form.show();
      const visible: boolean = await firstValueFrom(form.visible$);
      expect(visible).toBeTrue();
    });

    it('should be updated with the updateVisible method', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(true),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateVisibleState((visible) => !visible);
      const visible: boolean = await firstValueFrom(form.visible$);
      expect(visible).toBeTrue();
    });

    it('should be updated with the updateVisible method returning a promise', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(true),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateVisibleState((visible) => Promise.resolve(!visible));
      const visible: boolean = await firstValueFrom(form.visible$);
      expect(visible).toBeTrue();
    });

    it('should be updated with the updateVisible method returning an observable', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => of(true),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateVisibleState((visible) => of(!visible));
      const visible: boolean = await firstValueFrom(form.visible$);
      expect(visible).toBeTrue();
    });

    it('should emit visible with the options and subject', async () => {
      const visible$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => visible$$.asObservable(),
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);

      visible$$.next(false);
      const visible: boolean = await firstValueFrom(form.visible$);
      expect(visible).toBeTrue();

      form.show();
      const visible2: boolean = await firstValueFrom(form.visible$);
      expect(visible2).toBeTrue();
    });
  });

  describe('disable attribute', () => {
    it('should be updated when the options disable is updated', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(true, false),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      const disable: boolean = await firstValueFrom(form.disable$);
      expect(disable).toBeTrue();
      const disable2: boolean = await firstValueFrom(form.disable$);
      expect(disable2).toBeFalse();
    });

    it('should be updated with the disable method', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(false),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      form.disable();
      const disable: boolean = await firstValueFrom(form.disable$);
      expect(disable).toBeTrue();
    });

    it('should be updated with the updateDisable method', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(false),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateDisabledState((disable) => !disable);
      const disable: boolean = await firstValueFrom(form.disable$);
      expect(disable).toBeTrue();
    });

    it('should be updated with the updateDisable method returning a promise', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(false),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateDisabledState((disable) => Promise.resolve(!disable));
      const disable: boolean = await firstValueFrom(form.disable$);
      expect(disable).toBeTrue();
    });

    it('should be updated with the updateDisable method returning an observable', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(false),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateDisabledState((disable) => of(!disable));
      const disable: boolean = await firstValueFrom(form.disable$);
      expect(disable).toBeTrue();
    });

    it('should emit disable with the options and subject', async () => {
      const disable$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => disable$$.asObservable(),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);

      disable$$.next(true);
      const disable: boolean = await firstValueFrom(form.disable$);
      expect(disable).toBeTrue();

      form.disable();
      const disable2: boolean = await firstValueFrom(form.disable$);
      expect(disable2).toBeTrue();
    });

    it('should be disabled when the parent form is invalid', async () => {
      const parent: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(true),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(false),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      const parentContext: DynContext<string, {}> = { dynForm: parent, name: 'root' };
      parent.setContext(parentContext);

      const formContext: DynContext<string, {}> = { dynForm: form, name: 'child', parent: parentContext };
      form.setContext(formContext);

      const disable: boolean = await firstValueFrom(form.disable$);
      expect(disable).toBeTrue();
    });
  });

  describe('enable attribute', () => {
    it('should be updated when the options disable is updated', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(true, false),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      const enable: boolean = await firstValueFrom(form.enable$);
      expect(enable).toBeFalse();
      const enable2: boolean = await firstValueFrom(form.enable$);
      expect(enable2).toBeTrue();
    });

    it('should be updated with the enable method', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(true),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      form.enable();
      const enable: boolean = await firstValueFrom(form.enable$);
      expect(enable).toBeTrue();
    });

    it('should be updated with the updateEnable method', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(true),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateEnabledState((enable) => !enable);
      const enable: boolean = await firstValueFrom(form.enable$);
      expect(enable).toBeTrue();
    });

    it('should be updated with the updateEnable method returning a promise', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(true),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateEnabledState((enable) => Promise.resolve(!enable));
      const enable: boolean = await firstValueFrom(form.enable$);
      expect(enable).toBeTrue();
    });

    it('should be updated with the updateEnable method returning an observable', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => of(true),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);
      await form.updateEnabledState((enable) => of(!enable));
      const enable: boolean = await firstValueFrom(form.enable$);
      expect(enable).toBeTrue();
    });

    it('should emit enable with the options and subject', async () => {
      const enable$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => enable$$.asObservable(),
        hide: () => EMPTY,
        validators: () => EMPTY
      });
      form.setContext({} as DynContext<string, {}>);

      enable$$.next(false);
      const enable: boolean = await firstValueFrom(form.enable$);
      expect(enable).toBeTrue();

      form.enable();
      const enable2: boolean = await firstValueFrom(form.enable$);
      expect(enable2).toBeTrue();
    });
  });

  describe('valid attribute', () => {
    it('should be valid when the options validators is valid', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => of([
          () => of(undefined),
          () => of(undefined),
          () => of(undefined)
        ])
      });
      form.setContext({} as DynContext<string, {}>);
      const valid: boolean = await firstValueFrom(form.valid$);
      expect(valid).toBeTrue();
    });

    it('should emit invalid with the options are invalid', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => of([
          () => of(undefined),
          () => of(undefined),
          () => of({ message: 'error' })
        ])
      });
      form.setContext({} as DynContext<string, {}>);
      const valid: boolean = await firstValueFrom(form.valid$);
      expect(valid).toBeFalse();
    });

    it('should be updated when the options validators is updated', async () => {
      const validators$$: BehaviorSubject<DynOperation<string, {}, DynValidatorError | undefined>[]> = new BehaviorSubject<DynOperation<string, {}, DynValidatorError | undefined>[]>([]);
      const validator$$: BehaviorSubject<DynValidatorError | undefined> = new BehaviorSubject<DynValidatorError | undefined>(undefined);
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => validators$$.asObservable()
      });
      form.setContext({} as DynContext<string, {}>);
      const valid: boolean = await firstValueFrom(form.valid$);
      expect(valid).toBeTrue();

      validators$$.next([() => validator$$.asObservable()]);
      const valid2: boolean = await firstValueFrom(form.valid$);
      expect(valid2).toBeTrue();

      validator$$.next({ message: 'error' });
      const valid3: boolean = await firstValueFrom(form.valid$);
      expect(valid3).toBeFalse();
    });
  });

  describe('invalid attribute', () => {
    it('should be invalid when the options validators is invalid', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => of([
          () => of(undefined),
          () => of(undefined),
          () => of({ message: 'error' })
        ])
      });
      form.setContext({} as DynContext<string, {}>);
      const invalid: boolean = await firstValueFrom(form.invalid$);
      expect(invalid).toBeTrue();
    });

    it('should emit valid with the options are valid', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => of([
          () => of(undefined),
          () => of(undefined),
          () => of(undefined)
        ])
      });
      form.setContext({} as DynContext<string, {}>);
      const invalid: boolean = await firstValueFrom(form.invalid$);
      expect(invalid).toBeFalse();
    });

    it('should be updated when the options validators is updated', async () => {
      const validators$$: BehaviorSubject<DynOperation<string, {}, DynValidatorError | undefined>[]> = new BehaviorSubject<DynOperation<string, {}, DynValidatorError | undefined>[]>([]);
      const validator$$: BehaviorSubject<DynValidatorError | undefined> = new BehaviorSubject<DynValidatorError | undefined>(undefined);
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => validators$$.asObservable()
      });
      form.setContext({} as DynContext<string, {}>);
      const invalid: boolean = await firstValueFrom(form.invalid$);
      expect(invalid).toBeFalse();

      validators$$.next([() => validator$$.asObservable()]);
      const invalid2: boolean = await firstValueFrom(form.invalid$);
      expect(invalid2).toBeFalse();

      validator$$.next({ message: 'error' });
      const invalid3: boolean = await firstValueFrom(form.invalid$);
      expect(invalid3).toBeTrue();
    });
  });

  describe('validatorsErrors attribute', () => {
    it('should be updated when the options validators is updated', async () => {
      const validators$$: BehaviorSubject<DynOperation<string, {}, DynValidatorError | undefined>[]> = new BehaviorSubject<DynOperation<string, {}, DynValidatorError | undefined>[]>([]);
      const validator$$: BehaviorSubject<DynValidatorError | undefined> = new BehaviorSubject<DynValidatorError | undefined>(undefined);
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => validators$$.asObservable()
      });
      form.setContext({} as DynContext<string, {}>);
      const validatorsErrors: DynValidatorError[] = await firstValueFrom(form.validatorsErrors$);
      expect(validatorsErrors).toEqual([]);

      validators$$.next([() => validator$$.asObservable()]);
      const validatorsErrors2: DynValidatorError[] = await firstValueFrom(form.validatorsErrors$);
      expect(validatorsErrors2).toEqual([]);

      validator$$.next({ message: 'error' });
      const validatorsErrors3: DynValidatorError[] = await firstValueFrom(form.validatorsErrors$);
      expect(validatorsErrors3).toEqual([{ message: 'error' }]);
    });

    it('should emit validatorsErrors with an empty array', async () => {
      const form: EditableDynForm<string, {}> = new EditableDynForm<string, {}>({
        value: () => EMPTY,
        data: () => EMPTY,
        disable: () => EMPTY,
        hide: () => EMPTY,
        validators: () => of([])
      });
      form.setContext({} as DynContext<string, {}>);
      const validatorsErrors: DynValidatorError[] = await firstValueFrom(form.validatorsErrors$);
      expect(validatorsErrors).toEqual([]);
    });
  });
});

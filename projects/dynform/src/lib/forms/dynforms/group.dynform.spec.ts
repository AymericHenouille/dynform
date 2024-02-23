import { BehaviorSubject, EMPTY, firstValueFrom, map, of } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { DynOperation } from '../../models/dynoperation.model';
import { DynValidatorError } from '../../models/dynvalidator.model';
import { DynFormValue } from '../../models/value.model';
import { EditableDynForm } from './editable.dynform';
import { GroupDynForm } from './group.dynform';

function applyDefaultContext<T, D>(form: EditableDynForm<T, D>): EditableDynForm<any, any> {
  form.setContext({} as DynContext<T, D>)
  return form;
}

describe('The GroupDynForm', () => {
  describe('value', () => {
    it('should be update when the children value is updated', async () => {
      type User = { name: string, age: number };
      const name$$: BehaviorSubject<string> = new BehaviorSubject<string>('Benoit');
      const age$$: BehaviorSubject<number> = new BehaviorSubject<number>(5);
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => name$$.pipe(map((value) => ({ value }))),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => age$$.pipe(map((value) => ({ value }))),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });
      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'Benoit', age: 5 }
      });
      name$$.next('Benoit2');
      const value2: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value2).toEqual({
        label: undefined,
        value: { name: 'Benoit2', age: 5 }
      });
      age$$.next(6);
      const value3: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value3).toEqual({
        label: undefined,
        value: { name: 'Benoit2', age: 6 }
      });
    });

    it('should be update when the label is updated', async () => {
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => of({ value: 'Benoit' }),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => of({ value: 5 }),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });
      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'Benoit', age: 5 }
      });
      form.setLabel('User');
      const value2: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value2).toEqual({
        label: 'User',
        value: { name: 'Benoit', age: 5 }
      });
    });

    it('should be update when the label is updated with udpateLabel method', async () => {
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => of({ value: 'Benoit' }),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => of({ value: 5 }),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });
      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'Benoit', age: 5 }
      });

      form.setLabel('User');
      await form.updateLabel((label) => label?.toUpperCase());

      const value2: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value2).toEqual({
        label: 'USER',
        value: { name: 'Benoit', age: 5 }
      });
    });

    it('should be update when the label is updated with udpateLabel method returning Promise', async () => {
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => of({ value: 'Benoit' }),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => of({ value: 5 }),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });
      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'Benoit', age: 5 }
      });

      form.setLabel('User');
      await form.updateLabel((label) => Promise.resolve(label?.toUpperCase()));

      const value2: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value2).toEqual({
        label: 'USER',
        value: { name: 'Benoit', age: 5 }
      });
    });

    it('should be update when the label is updated with udpateLabel method returning Observable', async () => {
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => of({ value: 'Benoit' }),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => of({ value: 5 }),
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => EMPTY,
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });
      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'Benoit', age: 5 }
      });

      form.setLabel('User');
      await form.updateLabel((label) => of(label?.toUpperCase()));

      const value2: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value2).toEqual({
        label: 'USER',
        value: { name: 'Benoit', age: 5 }
      });
    });

    it('should be update when the setValues method is called', async () => {
      type User = { name: string, age: number };

      const nameForm: EditableDynForm<string, {}> = applyDefaultContext(new EditableDynForm<string, {}>({
        value: () => EMPTY,
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const ageForm: EditableDynForm<number, {}> = applyDefaultContext(new EditableDynForm<number, {}>({
        value: () => EMPTY,
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: { name: nameForm, age: ageForm, },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });

      form.writeValue({
        value: { name: 'Benoit', age: 5 }
      });

      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'Benoit', age: 5 }
      });

      const nameValue$: DynFormValue<string> = await firstValueFrom(nameForm.value$);
      expect(nameValue$).toEqual({ value: 'Benoit' });

      const ageValue$: DynFormValue<number> = await firstValueFrom(ageForm.value$);
      expect(ageValue$).toEqual({ value: 5 });
    });

    it('should be update when the updateValues method is called', async () => {
      type User = { name: string, age: number };

      const nameForm: EditableDynForm<string, {}> = applyDefaultContext(new EditableDynForm<string, {}>({
        value: () => of({ value: 'Benoit' }),
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const ageForm: EditableDynForm<number, {}> = applyDefaultContext(new EditableDynForm<number, {}>({
        value: () => of({ value: 5 }),
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: { name: nameForm, age: ageForm, },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });

      await form.updateValue(({value}) => ({
        label: undefined,
        value: {
          name: value.name.toUpperCase(),
          age: value.age + 20
        }
      }));

      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'BENOIT', age: 25 }
      });

      const nameValue$: DynFormValue<string> = await firstValueFrom(nameForm.value$);
      expect(nameValue$).toEqual({ value: 'BENOIT' });

      const ageValue$: DynFormValue<number> = await firstValueFrom(ageForm.value$);
      expect(ageValue$).toEqual({ value: 25 });
    });

    it('should be update when the updateValues method is called with Promise', async () => {
      type User = { name: string, age: number };

      const nameForm: EditableDynForm<string, {}> = applyDefaultContext(new EditableDynForm<string, {}>({
        value: () => of({ value: 'Benoit' }),
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const ageForm: EditableDynForm<number, {}> = applyDefaultContext(new EditableDynForm<number, {}>({
        value: () => of({ value: 5 }),
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: { name: nameForm, age: ageForm, },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });

      await form.updateValue(({value}) => Promise.resolve({
        label: undefined,
        value: {
          name: value.name.toUpperCase(),
          age: value.age + 20
        }
      }));

      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'BENOIT', age: 25 }
      });

      const nameValue$: DynFormValue<string> = await firstValueFrom(nameForm.value$);
      expect(nameValue$).toEqual({ value: 'BENOIT' });

      const ageValue$: DynFormValue<number> = await firstValueFrom(ageForm.value$);
      expect(ageValue$).toEqual({ value: 25 });
    });

    it('should be update when the updateValues method is called with Observable', async () => {
      type User = { name: string, age: number };

      const nameForm: EditableDynForm<string, {}> = applyDefaultContext(new EditableDynForm<string, {}>({
        value: () => of({ value: 'Benoit' }),
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const ageForm: EditableDynForm<number, {}> = applyDefaultContext(new EditableDynForm<number, {}>({
        value: () => of({ value: 5 }),
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: { name: nameForm, age: ageForm, },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });

      await form.updateValue(({value}) => of({
        label: undefined,
        value: {
          name: value.name.toUpperCase(),
          age: value.age + 20
        }
      }));

      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'BENOIT', age: 25 }
      });

      const nameValue$: DynFormValue<string> = await firstValueFrom(nameForm.value$);
      expect(nameValue$).toEqual({ value: 'BENOIT' });

      const ageValue$: DynFormValue<number> = await firstValueFrom(ageForm.value$);
      expect(ageValue$).toEqual({ value: 25 });
    });

    it('should be update when the patchValue method is called', async () => {
      type User = { name: string, age: number };

      const nameForm: EditableDynForm<string, {}> = applyDefaultContext(new EditableDynForm<string, {}>({
        value: () => of({ value: 'Benoit' }),
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const ageForm: EditableDynForm<number, {}> = applyDefaultContext(new EditableDynForm<number, {}>({
        value: () => of({ value: 5 }),
        hide: () => EMPTY,
        disable: () => EMPTY,
        validators: () => EMPTY,
        data: () => EMPTY,
      }));

      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: { name: nameForm, age: ageForm, },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => EMPTY,
        }
      });

      await form.patchValue({
        value: { name: 'BENOIT' }
      });

      const value: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value).toEqual({
        label: undefined,
        value: { name: 'BENOIT', age: 5 }
      });

      const nameValue$: DynFormValue<string> = await firstValueFrom(nameForm.value$);
      expect(nameValue$).toEqual({ value: 'BENOIT' });

      const ageValue$: DynFormValue<number> = await firstValueFrom(ageForm.value$);
      expect(ageValue$).toEqual({ value: 5 });

      await form.patchValue({
        value: { age: 25 }
      });

      const value2: DynFormValue<User> = await firstValueFrom(form.value$);
      expect(value2).toEqual({
        label: undefined,
        value: { name: 'BENOIT', age: 25 }
      });

      const nameValue$2: DynFormValue<string> = await firstValueFrom(nameForm.value$);
      expect(nameValue$2).toEqual({ value: 'BENOIT' });

      const ageValue$2: DynFormValue<number> = await firstValueFrom(ageForm.value$);
      expect(ageValue$2).toEqual({ value: 25 });
    });
  });

  describe('valid attribute', () => {
    it('should be valid when the options validators is valid', async () => {
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([]),
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([]),
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => of([
            () => of(undefined),
            () => of(undefined),
            () => of(undefined),
          ]),
        }
      });
      form.setContext({} as DynContext<string, {}>);
      const valid: boolean = await firstValueFrom(form.valid$);
      expect(valid).toBeTrue();
    });

    it('should emit invalid with the options are invalid', async () => {
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([]),
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([]),
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => of([
            () => of(undefined),
            () => of(undefined),
            () => of({ message: 'error' }),
          ]),
        }
      });
      form.setContext({} as DynContext<string, {}>);
      const valid: boolean = await firstValueFrom(form.valid$);
      expect(valid).toBeFalse();
    });

    it('should be updated when the options validators is updated', async () => {
      const validators$$: BehaviorSubject<DynOperation<string, {}, DynValidatorError | undefined>[]> = new BehaviorSubject<DynOperation<string, {}, DynValidatorError | undefined>[]>([]);
      const validator$$: BehaviorSubject<DynValidatorError | undefined> = new BehaviorSubject<DynValidatorError | undefined>(undefined);
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([]),
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([]),
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => validators$$.asObservable(),
        }
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

    it('should be invalid when one children is invalid', async () => {
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([]),
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([
              () => of({ message: 'error' }),
            ]),
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => of([]),
        }
      });
      form.setContext({} as DynContext<string, {}>);
      const valid: boolean = await firstValueFrom(form.valid$);
      expect(valid).toBeFalse();
    });
  });

  describe('The invalid attribute', () => {
    it('should be the opposite of the valid attribute', async () => {
      type User = { name: string, age: number };
      const form: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        fields: {
          name: applyDefaultContext(new EditableDynForm<string, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([]),
            data: () => EMPTY,
          })),
          age: applyDefaultContext(new EditableDynForm<number, {}>({
            value: () => EMPTY,
            hide: () => EMPTY,
            disable: () => EMPTY,
            validators: () => of([
              () => of({ message: 'error' }),
            ]),
            data: () => EMPTY,
          })),
        },
        options: {
          data: () => EMPTY,
          hide: () => EMPTY,
          disable: () => EMPTY,
          validators: () => of([]),
        }
      });
      form.setContext({} as DynContext<string, {}>);
      const invalid: boolean = await firstValueFrom(form.invalid$);
      expect(invalid).toBeTrue();
    });
  });
});

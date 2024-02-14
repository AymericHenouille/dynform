import { Observable, of } from 'rxjs';
import { DynFormValue } from '../models/value.model';
import { DynFormOptions } from './creator/dynform.creator';
import { DynFormContext } from './dynform-context.model';
import { FieldDynForm } from './field.dynform';
import { GroupDynForm } from './group.dynform';

function createFieldOptions<TValue, TData>(options: Partial<DynFormOptions<TValue, TData>>): DynFormOptions<TValue, TData> {
  return Object.assign({
    value: (context: DynFormContext<TValue, TData>) => of(''),
    data: (context: DynFormContext<TValue, TData>) => of({}),
    disabled: (context: DynFormContext<TValue, TData>) => of(false),
    hide: (context: DynFormContext<TValue, TData>) => of(false),
    validators: (context: DynFormContext<TValue, TData>) => of([]),
    placeholder: (context: DynFormContext<TValue, TData>) => of(''),
  }, options);
}

function createDynFieldForn<TValue, TData>(name: string, options: DynFormOptions<TValue, TData>): FieldDynForm<TValue, TData> {
  const dynFieldForm: FieldDynForm<TValue, TData> = new FieldDynForm(options);
  dynFieldForm.setContext({ name, dynForm: dynFieldForm });
  return dynFieldForm;
}

describe('The GroupDynForm', () => {
  describe('when editing the value', () => {
    it('should return the value of the form', (done) => {
      type User = { name: string, age: number };
      const groupDynForm: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        name: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })),
        age: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })),
      }, createFieldOptions({}));
      const value$: Observable<DynFormValue<User> | undefined> = groupDynForm.value$;
      let index: number = 0;
      value$.subscribe((value: DynFormValue<User> | undefined) => {
        switch (index++) {
          case 0:
            expect(value).toEqual({ value: { name: 'Benoit', age: undefined } });
            break;
          case 1:
            expect(value).toEqual({ value: { name: 'Benoit', age: 24 } });
            done();
            break;
        }
      });
    });

    it('should set the new value', (done) => {
      type User = { name: string, age: number };
      const groupDynForm: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        name: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })),
        age: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })),
      }, createFieldOptions({}));
      const value$: Observable<DynFormValue<User> | undefined> = groupDynForm.value$;
      let index: number = 0;
      value$.subscribe((value: DynFormValue<User> | undefined) => {
        switch (index++) {
          case 0:
            expect(value).toEqual({ value: { name: 'Benoit', age: undefined } });
            break;
          case 1:
            expect(value).toEqual({ value: { name: 'Benoit', age: 24 } });
            break;
          case 2:
            expect(value).toEqual({ value: { name: 'Geoffrey', age: 24 } });
            break;
          case 3:
            expect(value).toEqual({ value: { name: 'Geoffrey', age: 25 } });
            done();
            break;
        }
      });
      groupDynForm.writeValue({
        value: { name: 'Geoffrey', age: 25 }
      });
    });

    it('should set the undefined value', (done) => {
      type User = { name: string, age: number };
      const groupDynForm: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        name: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })),
        age: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })),
      }, createFieldOptions({}));
      const value$: Observable<DynFormValue<User> | undefined> = groupDynForm.value$;
      let index: number = 0;
      value$.subscribe((value: DynFormValue<User> | undefined) => {
        switch (index++) {
          case 0:
            expect(value).toEqual({ value: { name: 'Benoit', age: undefined } });
            break;
          case 1:
            expect(value).toEqual({ value: { name: 'Benoit', age: 24 } });
            break;
          case 3:
            expect(value).toEqual({ value: { name: undefined, age: undefined } });
            done();
            break;
        }
      });
      groupDynForm.writeValue(undefined);
    });

    it('should update the value of the form', (done) => {
      type User = { name: string, age: number };
      const groupDynForm: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        name: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })),
        age: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })),
      }, createFieldOptions({}));
      const value$: Observable<DynFormValue<User> | undefined> = groupDynForm.value$;
      let index: number = 0;
      value$.subscribe((value: DynFormValue<User> | undefined) => {
        switch (index++) {
          case 0:
            expect(value).toEqual({ value: { name: 'Benoit', age: undefined } });
            break;
          case 1:
            expect(value).toEqual({ value: { name: 'Benoit', age: 24 } });
            break;
          case 2:
            expect(value).toEqual({ value: { name: 'BENOIT', age: 24 } });
            done();
            break;
        }
      });
      groupDynForm.updateValue((value) => ({
        value: { ...value?.value, name: value?.value.name?.toUpperCase() }
      }));
    });

    it('should patch the value of the form', (done) => {
      type User = { name: string, age: number };
      const groupDynForm: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        name: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })),
        age: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })),
      }, createFieldOptions({}));
      const value$: Observable<DynFormValue<User> | undefined> = groupDynForm.value$;
      let index: number = 0;
      value$.subscribe((value: DynFormValue<User> | undefined) => {
        console.log(value);
        switch (index++) {
          case 0:
            expect(value).toEqual({ value: { name: 'Benoit', age: undefined } });
            break;
          case 1:
            expect(value).toEqual({ value: { name: 'Benoit', age: 24 } });
            break;
          case 2:
            expect(value).toEqual({ value: { name: 'Geoffrey', age: 24 } });
            done();
            break;
        }
      });
      groupDynForm.patchValue({ value: { name: 'Geoffrey' } });
    });
  });
});

import { Observable, of } from 'rxjs';
import { DynFormValue } from '../models/value.model';
import { DynFormOptions } from './creator/dynform.creator';
import { FieldDynForm } from './field.dynform';
import { GroupDynForm } from './group.dynform';

function createFieldOptions<TValue, TData>(options: Partial<DynFormOptions<TValue, TData>>): DynFormOptions<TValue, TData> {
  return Object.assign({
    value: () => of(''),
    data: () => of({}),
    disabled: () => of(false),
    hide: () => of(false),
    validators: () => of([]),
    placeholder: () => of(''),
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
        children: [
          { key: 'name', form: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Geoffrey' }, { value: 'Benoit' }) })) },
          { key: 'age', form: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }, { value: 25 }) })) },
        ],
        data: () => of({}),
        disabled: () => of(false),
        hide: () => of(false),
        validators: () => of([]),
      });
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
            expect(value).toEqual({ value: { name: 'Benoit', age: 25 } });
            done();
            break;
        }
      });
    });

    it('should set the new value', (done) => {
      type User = { name: string, age: number };
      const groupDynForm: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        children: [
          { key: 'name', form: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })) },
          { key: 'age', form: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })) },
        ],
        data: () => of({}),
        disabled: () => of(false),
        hide: () => of(false),
        validators: () => of([]),
      });
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
        children: [
          { key: 'name', form: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })) },
          { key: 'age', form: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })) },
        ],
        data: () => of({}),
        disabled: () => of(false),
        hide: () => of(false),
        validators: () => of([]),
      });
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
        children: [
          { key: 'name', form: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })) },
          { key: 'age', form: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })) },
        ],
        data: () => of({}),
        disabled: () => of(false),
        hide: () => of(false),
        validators: () => of([]),
      });
      const value$: Observable<DynFormValue<User> | undefined> = groupDynForm.value$;
      let index: number = 0;
      value$.subscribe((value: DynFormValue<User> | undefined) => {
        switch (index++) {
          case 0:
            expect(value).toEqual({ value: { name: 'Benoit', age: undefined } });
            break;
          case 1:
            expect(value).toEqual({ value: { name: 'Benoit', age: 24 } });
            groupDynForm.updateValue((value) => ({
              value: {
                name: value?.value.name?.toUpperCase(),
                age: (value?.value.age ?? 0) + 1,
              }
            }));
            break;
          case 2:
            expect(value).toEqual({ value: { name: 'BENOIT', age: 24 } });
            break;
          case 3:
            expect(value).toEqual({ value: { name: 'BENOIT', age: 25 } });
            done();
            break;
        }
      });
    });

    it('should patch the value of the form', (done) => {
      type User = { name: string, age: number };
      const groupDynForm: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
        children: [
          { key: 'name', form: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })) },
          { key: 'age', form: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })) },
        ],
        data: () => of({}),
        disabled: () => of(false),
        hide: () => of(false),
        validators: () => of([]),
      });
      const value$: Observable<DynFormValue<User> | undefined> = groupDynForm.value$;
      let index: number = 0;
      value$.subscribe((value: DynFormValue<User> | undefined) => {
        switch (index++) {
          case 0:
            expect(value).toEqual({ value: { name: 'Benoit', age: undefined } });
            break;
          case 1:
            expect(value).toEqual({ value: { name: 'Benoit', age: 24 } });
            groupDynForm.patchValue({ value: { name: 'Geoffrey' } });
            break;
          case 2:
            expect(value).toEqual({ value: { name: 'Geoffrey', age: 24 } });
            groupDynForm.patchValue({ value: { age: 25 } });
            break;
          case 3:
            expect(value).toEqual({ value: { name: 'Geoffrey', age: 25 } });
            done();
            break;
        }
      });
    });

    it('should return set value on encapsulated form', (done) => {
      const groupDynForm: GroupDynForm<{ a: { a1: string }, b: { b1: string } }, {}> = new GroupDynForm({
        children: [
          {
            key: 'a',
            form: new GroupDynForm<{ a1: string }, {}>({
              children: [
                { key: 'a1', form: createDynFieldForn('a1', createFieldOptions({ value: () => of({ value: 'A1' }) })) }
              ],
              data: () => of({}),
              disabled: () => of(false),
              hide: () => of(false),
              validators: () => of([]),
            })
          },
          {
            key: 'b',
            form: new GroupDynForm<{ b1: string }, {}>({
              children: [
                { key: 'b1', form: createDynFieldForn('b1', createFieldOptions({ value: () => of({ value: 'B1' }) })) }
              ],
              data: () => of({}),
              disabled: () => of(false),
              hide: () => of(false),
              validators: () => of([]),
            })
          }
        ],
        data: () => of({}),
        disabled: () => of(false),
        hide: () => of(false),
        validators: () => of([]),
      });
      const value$: Observable<DynFormValue<{ a: { a1: string }, b: { b1: string } }> | undefined> = groupDynForm.value$;
      let index: number = 0;
      value$.subscribe((value: DynFormValue<{ a: { a1: string }, b: { b1: string } }> | undefined) => {
        switch (index++) {
          case 0:
            expect(value).toEqual({ value: { a: { a1: 'A1' }, b: { b1: undefined } } } as any as DynFormValue<{ a: { a1: string }, b: { b1: string } }>);
            break;
          case 1:
            expect(value).toEqual({ value: { a: { a1: 'A1' }, b: { b1: 'B1' } } });
            break;
          case 2:
            expect(value).toEqual({ value: { a: { a1: 'A1' }, b: { b1: 'B2' } } });
            done();
            break;
        }
      });
      groupDynForm.writeValue({ value: { a: { a1: 'A1' }, b: { b1: 'B2' } } });
    });
  });

  describe('when editing the data', () => {
    it('should return the data of the form', (done) => {
      type Data = { label: string, index: number };
      const groupDynForm: GroupDynForm<{}, Data> = new GroupDynForm<{}, Data>({
        children: [],
        data: () => of({
          label: () => of('Benoit'),
          index: () => of(0, 1)
        }),
        disabled: () => of(false),
        hide: () => of(false),
        validators: () => of([]),
      });
      groupDynForm.setContext({ name: 'root', dynForm: groupDynForm });
      const data$: Observable<Data> = groupDynForm.data$;
      let index: number = 0;
      data$.subscribe((data: Data) => {
        switch (index++) {
          case 0:
            expect(data).toEqual({ label: 'Benoit', index: 0 });
            break;
          case 1:
            expect(data).toEqual({ label: 'Benoit', index: 1 });
            done();
            break;
        }
      });
    });

    it('should set the new data', (done) => {
      type Data = { label: string, index: number };
      const groupDynForm: GroupDynForm<{}, Data> = new GroupDynForm<{}, Data>({
        children: [],
        data: () => of({
          label: () => of('Benoit'),
          index: () => of(0)
        }),
        disabled: () => of(false),
        hide: () => of(false),
        validators: () => of([]),
      });
      groupDynForm.setContext({ name: 'root', dynForm: groupDynForm });
      const data$: Observable<Data> = groupDynForm.data$;
      let index: number = 0;
      data$.subscribe((data: Data) => {
        console.log(data);
        switch (index++) {
          case 0:
            expect(data).toEqual({ label: 'Benoit',   index: 0 });
            groupDynForm.setData({ label: 'Geoffrey', index: 0 });
            break;
          case 1:
            expect(data).toEqual({ label: 'Geoffrey', index: 0 });
            groupDynForm.setData({ label: 'Geoffrey', index: 1 });
            break;
          case 2:
            expect(data).toEqual({ label: 'Geoffrey', index: 1 });
            done();
            break;
        }
      });
    });
  });

  // describe('when editing the disabled state', () => {
  //   it('should be enable by default', async () => {
  //     type User = { name: string, age: number };
  //     const groupDynForm: GroupDynForm<User, {}> = new GroupDynForm<User, {}>({
  //       name: createDynFieldForn('name', createFieldOptions({ value: () => of({ value: 'Benoit' }) })),
  //       age: createDynFieldForn('age', createFieldOptions({ value: () => of({ value: 24 }) })),
  //     });
  //     groupDynForm.setContext({ name: 'root', dynForm: groupDynForm });
  //     const disable$: Observable<boolean> = groupDynForm.disable$;
  //     const enabled$: Observable<boolean> = groupDynForm.enable$;

  //     const disable: boolean = await firstValueFrom(disable$);
  //     expect(disable).toBeFalse();
  //     const enabled: boolean = await firstValueFrom(enabled$);
  //     expect(enabled).toBeTrue();
  //   });
  // });
});

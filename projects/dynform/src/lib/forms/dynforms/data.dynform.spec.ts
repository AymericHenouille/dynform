import { BehaviorSubject, EMPTY, Subject, firstValueFrom, of } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { DataDynform } from './data.dynform';

describe('The DataDynform', () => {
  it('should emit data', async () => {
    type Value = { name: string, age: number };
    type Data = { label: string, index: number };
    const form: DataDynform<Value, Data> = new DataDynform<Value, Data>({
      data: () => of({
        label: () => of('My Label'),
        index: () => of(0),
      })
    });
    const context: DynContext<Value, Data> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
    form.setContext(context);
    const data: Data = await firstValueFrom(form.data$);
    expect(data).toEqual({ label: 'My Label', index: 0 });
  });

  it('should emit data with subject', async () => {
    type Value = { name: string, age: number };
    type Data = { label: string, index: number };
    const label$$: BehaviorSubject<string> = new BehaviorSubject<string>('My Label');
    const index$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    const form: DataDynform<Value, Data> = new DataDynform<Value, Data>({
      data: () => of({
        label: () => label$$,
        index: () => index$$,
      })
    });
    const context: DynContext<Value, Data> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
    form.setContext(context);

    form.setData({ label: 'My Label', index: 0 });
    const data: Data = await firstValueFrom(form.data$);
    expect(data).toEqual({ label: 'My Label', index: 0 });

    label$$.next('New Label');
    index$$.next(1);
    const newData: Data = await firstValueFrom(form.data$);
    expect(newData).toEqual({ label: 'New Label', index: 1 });

    label$$.next('New Label 2');
    const newData2: Data = await firstValueFrom(form.data$);
    expect(newData2).toEqual({ label: 'New Label 2', index: 1 });

    index$$.next(2);
    const newData3: Data = await firstValueFrom(form.data$);
    expect(newData3).toEqual({ label: 'New Label 2', index: 2 });
  });

  it('should emit data with setData method', async () => {
    type Value = { name: string, age: number };
    type Data = { label: string, index: number };
    const form: DataDynform<Value, Data> = new DataDynform<Value, Data>({
      data: () => of({
        label: () => EMPTY,
        index: () => EMPTY,
      })
    });
    const context: DynContext<Value, Data> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
    form.setContext(context);

    form.setData({ label: 'My Label', index: 0 });
    const data: Data = await firstValueFrom(form.data$);
    expect(data).toEqual({ label: 'My Label', index: 0 });

    form.setData({ label: 'New Label', index: 1 });
    const newData: Data = await firstValueFrom(form.data$);
    expect(newData).toEqual({ label: 'New Label', index: 1 });
  });

  describe('updateData method', () => {
    it('should emit data', async () => {
      type Value = { name: string, age: number };
      type Data = { label: string, index: number };
      const form: DataDynform<Value, Data> = new DataDynform<Value, Data>({
        data: () => of({
          label: () => of('Benoit'),
          index: () => of(0),
        })
      });
      const context: DynContext<Value, Data> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
      form.setContext(context);
      await form.updateData((data: Data) => ({
        label: data.label.toUpperCase(),
        index: data.index + 1,
      }));
      const newData: Data = await firstValueFrom(form.data$);
      expect(newData).toEqual({ label: 'BENOIT', index: 1 });
    });

    it('should emit data with a Promise', async () => {
      type Value = { name: string, age: number };
      type Data = { label: string, index: number };
      const form: DataDynform<Value, Data> = new DataDynform<Value, Data>({
        data: () => of({
          label: () => of('Benoit'),
          index: () => of(0),
        })
      });
      const context: DynContext<Value, Data> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
      form.setContext(context);
      await form.updateData((data: Data) => Promise.resolve({
        label: data.label.toUpperCase(),
        index: data.index + 1,
      }));
      const newData: Data = await firstValueFrom(form.data$);
      expect(newData).toEqual({ label: 'BENOIT', index: 1 });
    });

    it('should emit data with an Observable', async () => {
      type Value = { name: string, age: number };
      type Data = { label: string, index: number };
      const form: DataDynform<Value, Data> = new DataDynform<Value, Data>({
        data: () => of({
          label: () => of('Benoit'),
          index: () => of(0),
        })
      });
      const context: DynContext<Value, Data> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
      form.setContext(context);
      await form.updateData((data: Data) => of({
        label: data.label.toUpperCase(),
        index: data.index + 1,
      }));
      const newData: Data = await firstValueFrom(form.data$);
      expect(newData).toEqual({ label: 'BENOIT', index: 1 });
    });
  });

  it('should emit data with subject and setData method', async () => {
    type Value = { name: string, age: number };
    type Data = { label: string, index: number };
    const label$$: Subject<string> = new Subject<string>();
    const index$$: Subject<number> = new Subject<number>();
    const form: DataDynform<Value, Data> = new DataDynform<Value, Data>({
      data: () => of({
        label: () => label$$,
        index: () => index$$,
      })
    });
    const context: DynContext<Value, Data> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
    form.setContext(context);

    form.setData({ label: 'My Label', index: 0 });
    const data: Data = await firstValueFrom(form.data$);
    expect(data).toEqual({ label: 'My Label', index: 0 });

    label$$.next('New Label');
    index$$.next(0);
    const data2: Data = await firstValueFrom(form.data$);
    expect(data2).toEqual({ label: 'New Label', index: 0 });

    index$$.next(1);
    const data3: Data = await firstValueFrom(form.data$);
    expect(data3).toEqual({ label: 'New Label', index: 1 });

    form.setData({ label: 'New Label 2', index: 2 });
    index$$.next(3);
    const data4: Data = await firstValueFrom(form.data$);
    expect(data4).toEqual({ label: 'New Label 2', index: 3 });
  });
});

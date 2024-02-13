import { of } from 'rxjs';
import { UpdateValueFn, syncronizeValue } from './update-value.model';

describe('The syncronizeValue function', () => {

  it('should return a promise with a syncronized value', async () => {
    const value: string = 'value';
    const fn: UpdateValueFn<string> = (value) => value;
    const result: string = await syncronizeValue(fn, value);
    expect(result).toBe(value);
  });

  it('should return a promise with a promise value', async () => {
    const value: string = 'value';
    const fn: UpdateValueFn<string> = (value) => Promise.resolve(value);
    const result: string = await syncronizeValue(fn, value);
    expect(result).toBe(value);
  });

  it('should return a promise with a observable value', async () => {
    const value: string = 'value';
    const fn: UpdateValueFn<string> = (value) => of(value);
    const result: string = await syncronizeValue(fn, value);
    expect(result).toBe(value);
  });

});

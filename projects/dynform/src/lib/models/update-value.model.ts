import { Observable, firstValueFrom } from 'rxjs';

/**
 * The UpdateValueFn type represents a function that updates the value of a form controller.
 * The function can return a new value, a promise of a new value, or an observable of a new value.
 */
export type UpdateValueFn<T, R = T> = (value: T) => Observable<R> | Promise<R> | R;

/**
 * The syncronizeValue function synchronizes the value of a form controller.
 * @param fn The function that will update the value of the controller.
 * @param value The new value for the controller.
 * @returns A promise of the new value for the controller.
 */
export function syncronizeValue<T, R>(fn: UpdateValueFn<T, R>, value: T): Promise<R> {
  const result: R | Promise<R> | Observable<R> = fn(value);
  if (result instanceof Promise) {
    return result;
  } else if (result instanceof Observable) {
    return firstValueFrom(result);
  } else {
    return Promise.resolve(result);
  }
}

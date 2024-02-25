import { EMPTY, Observable, concat, map, of, switchMap } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';

/**
 * Create a new DynOperation with the given value.
 * @param value The value to create the operation with.
 * @returns A new DynOperation.
 */
export function use<TValue, TData, TUse>(...values: TUse[]): DynOperation<TValue, TData, TUse> {
  return () => of(...values);
}

/**
 * Create a new DynOperation with the async given values.
 * @param values The async values to create the operation with.
 * @returns A new DynOperation.
 */
export function useFrom<TValue, TData, TUse>(...values: (Observable<TUse> | Promise<TUse>)[]): DynOperation<TValue, TData, TUse> {
  return () => concat(...values);
}

/**
 * Create a new DynOperation that return an undefined value.
 * @returns A new DynOperation.
 */
export function useUndefined<TValue, TData>(): DynOperation<TValue, TData, undefined> {
  return () => of(undefined);
}

/**
 * Create a new DynOperation that return an empty observable.
 * @returns A new DynOperation.
 */
export function useEmpty<TValue, TData, TUse>(): DynOperation<TValue, TData, TUse> {
  return () => EMPTY;
}

/**
 * Options to create a new DynOperation with the if operator.
 */
export type UseIfOptions<TValue, TData, TUse> = {
  /**
   * The condition to check.
   */
  if: DynOperation<TValue, TData, boolean>,
  /**
   * The operation to execute if the condition is true.
   */
  then: DynOperation<TValue, TData, TUse>,
  /**
   * The operation to execute if the condition is false.
   * If not provided, the operation will return an empty observable.
   */
  else?: DynOperation<TValue, TData, TUse>,
};

/**
 * Create a new DynOperation with the if operator.
 * @param options The options to create the operation with.
 * @returns A new DynOperation.
 */
export function useIf<TValue, TData, TUse>(options: UseIfOptions<TValue, TData, TUse>): DynOperation<TValue, TData, TUse> {
  return (context: DynContext<TValue, TData>) => options.if(context).pipe(
    map((condition) => {
      if (condition) return options.then;
      return options.else ?? useEmpty<TValue, TData, TUse>();
    }),
    switchMap((operation) => operation(context)),
  );
}

/**
 * Options to create a new DynOperation with the when operator.
 */
export type UseWhenOptions<TValue, TData, TWhen extends number | string | symbol, TReturn> = {
  /**
   * The value to check.
   */
  when: DynOperation<TValue, TData, TWhen>,
  /**
   * The cases to check.
   */
  cases: {
    [key in TWhen]: DynOperation<TValue, TData, TReturn>;
  },
  /**
   * The default case to check.
   */
  defaults?: DynOperation<TValue, TData, TReturn>;
}

/**
 * Create a new DynOperation with the when operator.
 * @param options The options to create the operation with.
 * @returns A new DynOperation.
 */
export function useWhen<TValue, TData, TWhen extends number | string, TReturn>(options: UseWhenOptions<TValue, TData, TWhen, TReturn>): DynOperation<TValue, TData, TReturn> {
  return (context: DynContext<TValue, TData>) => options.when(context).pipe(
    map((value) => options.cases[value] ?? options.defaults ?? useEmpty<TValue, TData, TReturn>()),
    switchMap((operation) => operation(context)),
  );
}

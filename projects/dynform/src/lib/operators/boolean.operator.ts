import { Observable, combineLatest, map } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';

/**
 * The and operator take a list of boolean DynOperation and return a new DynOperation that return true if all the operations return true.
 * @param operations The list of operations.
 * @returns A new DynOperation that return true if all the operations return true.
 */
export function and<TValue, TData>(...operations: DynOperation<TValue, TData, boolean>[]): DynOperation<TValue, TData, boolean> {
  return (context: DynContext<TValue, TData>) => {
    const results: Observable<boolean>[] = operations.map((operation) => operation(context));
    return combineLatest(results).pipe(
      map((values: boolean[]) => values.every((value) => value)),
    );
  }
}

/**
 * The or operator take a list of boolean DynOperation and return a new DynOperation that return true if at least one of the operations return true.
 * @param operations The list of operations.
 * @returns A new DynOperation that return true if at least one of the operations return true.
 */
export function or<TValue, TData>(...operations: DynOperation<TValue, TData, boolean>[]): DynOperation<TValue, TData, boolean> {
  return (context: DynContext<TValue, TData>) => {
    const results: Observable<boolean>[] = operations.map((operation) => operation(context));
    return combineLatest(results).pipe(
      map((values: boolean[]) => values.some((value) => value)),
    );
  }
}

/**
 * The not operator take a boolean DynOperation and return a new DynOperation that return the opposite value.
 * @param operation The operation to negate.
 * @returns A new DynOperation that return the opposite value.
 */
export function not<TValue, TData>(operation: DynOperation<TValue, TData, boolean>): DynOperation<TValue, TData, boolean> {
  return (context: DynContext<TValue, TData>) => operation(context).pipe(
    map((value: boolean) => !value),
  );
}

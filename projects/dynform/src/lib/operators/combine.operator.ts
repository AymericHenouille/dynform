import { Observable, concat, mergeAll } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';

/**
 * The combine operator take a list of DynOperation and return a new DynOperation that return the concat result.
 * @param operations The operations to combine.
 * @returns A new DynOperation that return the concat result.
 */
export function combine<TValue, TData, TOperation>(...operations: (DynOperation<TValue, TData, TOperation> | DynOperation<TValue, TData, TOperation>[])[]): DynOperation<TValue, TData, TOperation> {
  const flatOperations: DynOperation<TValue, TData, TOperation>[] = operations.flat();
  return (context: DynContext<TValue, TData>) => {
    const results: Observable<TOperation>[] = flatOperations.map((operation) => operation(context));
    return concat(results).pipe(mergeAll());
  };
}

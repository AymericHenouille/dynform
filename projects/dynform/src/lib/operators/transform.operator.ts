import { map, mergeMap } from 'rxjs';
import { DynOperation } from '../models/dynoperation.model';

/**
 * map function use inside the transform operator.
 * @param value The value to transform.
 * @returns The transformed value.
 */
export type DynMapFn<TInput, TOuput> = (value: TInput) => TOuput;

/**
 * The transform operator take a DynOperation and a map function and return a new DynOperation that return the result of the map function.
 * @param operation The operation to transform.
 * @param mapFn The map function to apply.
 * @returns A new DynOperation that return the result of the map function.
 */
export function transform<TValue, TData, TInput, TOuput>(operation: DynOperation<TValue, TData, TInput>, mapFn: DynMapFn<TInput, TOuput>): DynOperation<TValue, TData, TOuput> {
  return (context) => operation(context).pipe(
    map((result) => mapFn(result))
  );
}

/**
 * map function use inside the transform operator.
 * @param value The value to transform.
 * @returns The transformed value.
 */
export type DynChainFn<TValue, TData, TInput, TOuput> = (value: TInput) => DynOperation<TValue, TData, TOuput>;

/**
 * The transform operator take a DynOperation and a chain function and return a new DynOperation that return the DynOperation of the chain function.
 * @param operation The operation to chain.
 * @param chainFn The chain function to apply.
 * @returns A new DynOperation that return the DynOperation of the chain function.
 */
export function chain<TValue, TData, TInput, TOuput>(operation: DynOperation<TValue, TData, TInput>, chainFn: DynChainFn<TValue, TData, TInput, TOuput>): DynOperation<TValue, TData, TOuput> {
  return (context) => operation(context).pipe(
    map((result) => chainFn(result)),
    mergeMap((operation) => operation(context))
  );
}

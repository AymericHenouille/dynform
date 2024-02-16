import { Observable } from 'rxjs';
import { DynContext } from './dyncontext.model';

/**
 * Represents a DynOperation.
 * @param context The context of the operation.
 * @returns The result of the operation.
 *
 * @template TContextValue The type of the context value.
 * @template TContextData The type of the context data.
 * @template TOperationValue The type of the operation value.
 */
export type DynOperation<TContextValue, TContextData, TOperationValue> = (context: DynContext<TContextValue, TContextData>) => Observable<TOperationValue>;

/**
 * A DynOperable is a DynOperation of any object.
 * each property of the object is a DynOperation.
 *
 * @template TContextValue The type of the context value.
 * @template TContextData The type of the context data.
 * @template TOperationValue The type of the operation value.
 */
export type DynOperable<TContextValue, TContextData, TOperationValue> = DynOperation<TContextValue, TContextData, {
  [key in keyof TOperationValue]: DynOperation<TContextValue, TContextData, TOperationValue[key]>
}>;

/**
 * Extracts the operation value from a DynOperation.
 *
 * @template TOperation The type of the operation.
 */
export type DynOperationValue<TOperation> = TOperation extends DynOperation<any, any, infer TOperationValue> ? TOperationValue : never;

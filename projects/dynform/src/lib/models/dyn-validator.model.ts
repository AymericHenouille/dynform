import { DynOperation } from './dyn-operation.model';

/**
 * Represents a dyn validator error.
 */
export interface DynValidatorError {
  /**
   * The message of the error.
   */
  message: string;
}

/**
 * Represents a dyn validator.
 * @template TContextValue The type of the value of the context.
 * @template TContextData The type of the data of the context.
 *
 * A dyn validator is a function that takes a context and returns an observable of a dyn validator error or undefined.
 * If the observable emit undefined, the validation is successful.
 */
export type DynValidator<TContextValue, TContextData> = DynOperation<TContextValue, TContextData, DynValidatorError | undefined>

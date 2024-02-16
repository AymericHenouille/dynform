import { DynOperation } from './dynoperation.model';

/**
 * A Standard DynValidatorError.
 *
 * @export
 * @interface DynValidatorError
 */
export interface DynValidatorError {
  /**
   * The message of the error.
   *
   * @type {string}
   * @memberof DynValidatorError
   */
  message: string;
}

/**
 * A DynValidator.
 *
 * @export
 * @interface DynValidator
 * @template TContextValue The type of the context value.
 * @template TContextData The type of the context data.
 */
export type DynValidator<TContextValue, TContextData> = DynOperation<TContextValue, TContextData, DynValidatorError | undefined>

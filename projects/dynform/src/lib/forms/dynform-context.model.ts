import { DynForm } from './dynform.model';

/**
 * The DynFormContext interface represents the context of a form controller.
 */
export interface DynFormContext<TContextValue, TContextData> {
  /**
   * The name of the controller.
   * It is used to reference the controller.
   */
  name: string | number | Symbol;
  /**
   * The current value of the controller.
   */
  dynForm: DynForm<TContextValue, TContextData>;
  /**
   * The parent context of the controller.
   * It is used to reference the parent controller.
   */
  parent?: DynFormContext<any, any>;
}

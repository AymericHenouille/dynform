
/**
 * The DynFormContext interface represents the context of a form controller.
 */
export interface DynContext<TValue, TData> {
  /**
   * The name of the controller.
   * It is used to reference the controller.
   */
  name: string | number | Symbol;
  /**
   * The current value of the controller.
   */
  dynForm: any;
  /**
   * The parent context of the controller.
   * It is used to reference the parent controller.
   */
  parent?: DynContext<any, any>;
}

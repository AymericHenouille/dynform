/**
 * Represents a value of a dynamic form control.
 */
export type DynFormValue<T> = {
  label?: string;
  value: T;
};

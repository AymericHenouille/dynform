/**
 * Represents a value of a dynamic form control.
 */
export type DynFormValue<T> = T extends Record<string | number | symbol, any>
  ? { label?: string; value: Partial<T>; }
  : { label?: string; value: T; };

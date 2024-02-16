/**
 * DynFormStatus is an enum that represents the status of a DynForm.
 * The status can be WAITING or RUNNING.
 * WAITING: The form is waiting for the context to be set.
 * RUNNING: The form is running.
 */
export enum DynFormStatus {
  WAITING = 'WAITING',
  RUNNING = 'RUNNING',
}

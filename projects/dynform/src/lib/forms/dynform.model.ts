import { Observable } from 'rxjs';
import { DynValidatorError } from '../models/dyn-validator.model';
import { UpdateValueFn } from '../models/update-value.model';
import { DynFormValue } from '../models/value.model';
import { DynFormContext } from './dynform-context.model';
import { DynFormStatus } from './dynform-status.model';

/**
 * The DynForm interface represents a form controller.
 */
export interface DynForm<TValue, TData = {}> {
  /**
   * The value of the controller.
   * In representing the value in real time, the value$ observable is used.
   */
  value$: Observable<DynFormValue<TValue> | undefined>;
  /**
   * The data of the controller.
   */
  data$: Observable<TData>;
  /**
   * The enabled state of the controller.
   * It is used to represent the enabled state in real time.
   * The state return true if the controller is enabled, otherwise false.
   */
  enable$: Observable<boolean>;
  /**
   * The disabled state of the controller.
   * It is used to represent the disabled state in real time.
   * The state return true if the controller is disabled, otherwise false.
   */
  disable$: Observable<boolean>;
  /**
   * The touched state of the controller.
   * It is used to represent the touched state in real time.
   * The state return true if the user has interacted with the form controller, e.g., by clicking or focusing on it.
   */
  touched$: Observable<boolean>;
  /**
   * The untouched state of the controller.
   * It is used to represent the untouched state in real time.
   * The state return true if the user has not yet interacted with the form controller, e.g., by clicking or focusing on it.
   */
  untouched$: Observable<boolean>;
  /**
   * The dirty state of the controller.
   * It is used to represent the dirty state in real time.
   * The state return true if the user has changed the value of the controller.
   */
  dirty$: Observable<boolean>;
  /**
   * The pristine state of the controller.
   * It is used to represent the pristine state in real time.
   * The state return true if the user has not yet changed the value of the controller.
   */
  pristine$: Observable<boolean>;
  /**
   * The valid state of the controller.
   * It is used to represent the valid state in real time.
   * The state return true if the controller has passed all validation checks, otherwise false.
   */
  valid$: Observable<boolean>;
  /**
   * The invalid state of the controller.
   * It is used to represent the invalid state in real time.
   * The state return true if the controller has failed any of the validation checks, otherwise false.
   */
  invalid$: Observable<boolean>;
  /**
   * The status of the controller.
   */
  status$: Observable<DynFormStatus>;
  /**
   * The context of the controller.
   */
  context$: Observable<DynFormContext<TValue, TData>>;
  /**
   * The hide state of the controller.
   */
  hidden$: Observable<boolean>;
  /**
   * The visible state of the controller.
   */
  visible$: Observable<boolean>;
  /**
   * The placeholder of the controller.
   */
  placeholder$: Observable<string>;
  /**
   * The errors of the controller.
   */
  validatorsErrors$: Observable<DynValidatorError[]>;
  /**
   * Update the value of the controller.
   *
   * @param {T} value The new value for the controller.
   * @memberof FrmController
   */
  writeValue(value: DynFormValue<TValue> | undefined): void;
  /**
   * Update the value of the controller with the provided function.
   * @param updateFn The function that will update the value of the controller.
   */
  updateValue(updateFn: UpdateValueFn<DynFormValue<TValue> | undefined>): Promise<void>;
  /**
   * Patch the value of the controller.
   * @param value The new value for the controller.
   */
  patchValue(value: DynFormValue<Partial<TValue>>): Promise<void>;
  /**
   * Set the validators of the controller.
   * @param placeholder The new validators for the controller.
   */
  setPlaceholder(placeholder: string): void;
  /**
   * Update the validators of the controller.
   * @param updateFn The function that will update the validators for the controller.
   */
  updatePlaceholder(updateFn: UpdateValueFn<string>): Promise<void>;
  /**
   * Set the value of the controller data.
   * @param data The new data for the controller.
   */
  setData(data: Partial<TData>): void;
  /**
   * Update the value of the controller data.
   * @param updateFn The function that will update the data for the controller.
   */
  updateData(updateFn: UpdateValueFn<Partial<TData>>): Promise<void>;
  /**
   * Patch the value of the controller data.
   * @param data The new data for the controller.
   */
  patchData(data: Partial<TData>): Promise<void>;
  /**
   * Set the context of the controller.
   * @param context The new context for the controller.
   */
  setContext(context: DynFormContext<TValue, TData>): void;
  /**
   * Update the context of the controller.
   * @param updateFn The function that will update the context for the controller.
   */
  updateContext(updateFn: UpdateValueFn<DynFormContext<TValue, TData>>): Promise<void>;
  /**
   * Update the enable state of the controller.
   * @param enable The new enable state for the controller.
   */
  setEnableState(enable: boolean): void;
  /**
   * Update the enable state of the controller.
   * @param updateFn The function that will update the enable state for the controller.
   */
  updateEnableState(updateFn: UpdateValueFn<boolean>): Promise<void>;
  /**
   * Update the disable state of the controller.
   * @param disable The new disable state for the controller.
   */
  setDisableState(disable: boolean): void;
  /**
   * Turn the enable state to true.
   */
  enable(): void;
  /**
   * Turn the disable state to true.
   */
  disable(): void;
  /**
   * Update the disable state of the controller.
   * @param updateFn The function that will update the disabled state for the controller.
   */
  updateDisableState(updateFn: UpdateValueFn<boolean>): Promise<void>;
  /**
   * Update the touched state of the controller.
   * @param touched The new touched state for the controller.
   */
  setTouchedState(touched: boolean): void;
  /**
   * Update the touched state of the controller.
   * @param updateFn The function that will update the touched state for the controller.
   */
  updateTouchedState(updateFn: UpdateValueFn<boolean>): Promise<void>;
  /**
   * Update the untouched state of the controller.
   * @param untouched The new untouched state for the controller.
   */
  setUntouchedState(untouched: boolean): void;
  /**
   * Update the untouched state of the controller.
   * @param updateFn The function that will update the untouched state for the controller.
   */
  updateUntouchedState(updateFn: UpdateValueFn<boolean>): Promise<void>;
  /**
   * Update the dirty state of the controller.
   * @param dirty The new dirty state for the controller.
   */
  setDirtyState(dirty: boolean): void;
  /**
   * Update the dirty state of the controller.
   * @param updateFn The function that will update the dirty state for the controller.
   */
  updateDirtyState(updateFn: UpdateValueFn<boolean>): Promise<void>;
  /**
   * Update the pristine state of the controller.
   * @param pristine The new pristine state for the controller.
   */
  setPristineState(pristine: boolean): void;
  /**
   * Update the pristine state of the controller.
   * @param updateFn The function that will update the pristine state for the controller.
   */
  updatePristineState(updateFn: UpdateValueFn<boolean>): Promise<void>;
  /**
   * Set the hide state of the controller.
   * @param hide The new hide state for the controller.
   */
  setHidden(hide: boolean): void;
  /**
   * Update the hide state of the controller.
   * @param updateFn The function that will update the hide state for the controller.
   */
  updateHidden(updateFn: UpdateValueFn<boolean>): Promise<void>;
  /**
   * Set the visible state of the controller.
   * @param visible The new visible state for the controller.
   */
  setVisible(visible: boolean): void;
  /**
   * Update the visible state of the controller.
   * @param updateFn The function that will update the visible state for the controller.
   */
  updateVisible(updateFn: UpdateValueFn<boolean>): Promise<void>;
  /**
   * Turn the hide state to false.
   */
  show(): void;
  /**
   * Turn the hide state to true.
   */
  hide(): void;
}

export interface DynformGroup<TValue, TData> extends DynForm<TValue, TData> {

}

export interface DynformArray<TValue, TData> extends DynForm<TValue, TData> {
  type: string;
}

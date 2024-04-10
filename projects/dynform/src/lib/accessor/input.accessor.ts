import { ControlValueAccessor } from '@angular/forms';

/**
 * Input accessor
 * This accessor is used to bind an input element to a dynform.
 */
export class InputAccessor implements ControlValueAccessor {
  /**
   * The onTouched function.
   */
  private onTouchedFn: () => void = () => {};
  /**
   * The onChange function.
   */
  private onChangeFn: (value: any) => void = () => {};

  /**
   * Creates a new instance of InputAccessor.
   * @param element The input element to bind.
   */
  public constructor(private readonly element: HTMLInputElement) {
    this.element.addEventListener('input', () => this.onChangeFn(this.element.value));
    this.element.addEventListener('blur', () => this.onTouchedFn());
  }

  /**
   * Write a value to the input element.
   * @param obj The value to write.
   */
  public writeValue(obj: any): void {
    this.element.value = obj;
  }

  /**
   * Register a change event.
   * @param fn The change event to register.
   */
  public registerOnChange(fn: (value: any) => void): void {
    this.onChangeFn = fn;
  }

  /**
   * Register a touch event.
   * @param fn The touch event to register.
   */
  public registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  /**
   * Set the disabled state of the input element.
   * @param isDisabled The disabled state to set.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.element.disabled = isDisabled;
  }
}

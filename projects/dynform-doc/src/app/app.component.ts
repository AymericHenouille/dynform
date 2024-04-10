import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { interval } from 'rxjs';
import { createFieldDynform } from '../../../dynform/src/lib/forms/creator/field-dynform.factory';
import { transform } from '../../../dynform/src/lib/operators/transform.operator';
import { use, useFrom } from '../../../dynform/src/lib/operators/use.operator';

@Component({
  selector: 'app-input',
  template: `
    <input
      [disabled]="disabled"
      [ngModel]="value"
      (ngModelChange)="onChange($event)" >
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  protected value: any;
  protected onChange: (value: any) => void = () => {};
  protected onTouched: () => void = () => {};
  protected disabled: boolean = false;

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public formControl = createFieldDynform({
    value: use({ value: 'hello world' }),
    disable: transform(
      useFrom(interval(1000)),
      (tick) => tick % 2 === 0
    ),
  });
}

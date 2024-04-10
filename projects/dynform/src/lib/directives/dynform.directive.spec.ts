import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DynContext } from '../models/dyncontext.model';
import { DynformDirective } from './dynform.directive';

describe('The dynform directive', () => {
  let context: DynContext<any, any>;
  let accessor: ControlValueAccessor;
  let elementRef: ElementRef<HTMLInputElement>;

  let directive: DynformDirective<any, any>;

  beforeEach(() => {
    context = {} as DynContext<any, any>;
    accessor = {} as ControlValueAccessor;
    elementRef = {} as ElementRef<HTMLInputElement>;
  });

  beforeEach(() => {
    directive = new DynformDirective(context, accessor, elementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});

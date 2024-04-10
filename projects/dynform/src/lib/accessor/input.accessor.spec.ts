import { InputAccessor } from './input.accessor';

describe('The InputAccessor', () => {
  let accessor: InputAccessor;
  let element: HTMLInputElement;

  beforeEach(() => {
    element = document.createElement('input');
    accessor = new InputAccessor(element);
  });

  it('should write a value to the input element', () => {
    accessor.writeValue('test');
    expect(element.value).toBe('test');
  });

  it('should register a change event', (done) => {
    const fn = (value: any) => {
      expect(value).toBe('test');
      done();
    };
    accessor.registerOnChange(fn);
    element.value = 'test';
    element.dispatchEvent(new Event('input'));
  });

  it('should register a touch event', (done) => {
    const fn = jasmine.createSpy();
    accessor.registerOnTouched(fn);
    element.dispatchEvent(new Event('blur'));
    setTimeout(() => {
      expect(fn).toHaveBeenCalled();
      done();
    });
  });

  it('should set the disabled state of the input element', () => {
    accessor.setDisabledState(true);
    expect(element.disabled).toBe(true);
  });
});

import { Observable, combineLatest, map } from 'rxjs';
import { DynFormValue } from '../models/value.model';
import { DynFormGroupOptions } from './creator/dynform-group.creator';
import { DynFormOptions } from './creator/dynform.creator';
import { DynForm } from './dynform.model';
import { FieldDynForm } from './field.dynform';

/**
 * Represents a group form controller.
 */
export class GroupDynForm<TValue, TData> extends FieldDynForm<TValue, TData>{
  /**
   * Creates an instance of GroupDynForm.
   * @param dynformGroupOptions The options of the form controller.
   * @param dynformOptions The options of the form controller.
   */
  public constructor(
    private readonly dynformGroupOptions: DynFormGroupOptions<TValue, TData>,
    dynformOptions: DynFormOptions<TValue, TData>,
  ) { super(dynformOptions); }

  public override get value$(): Observable<DynFormValue<TValue> | undefined> {
    const keys: (keyof TValue)[] = Object.keys(this.dynformGroupOptions) as (keyof TValue)[];
    const values$: Observable<Partial<TValue>>[] = keys.map((key: keyof TValue) => this.dynformGroupOptions[key].value$.pipe(
      map((value) => value?.value),
      map((value) => ({ [key]: value }) as Partial<TValue>),
    ));
    return combineLatest(values$).pipe(
      map((values: Partial<TValue>[]) => values.reduce((acc, value) => ({ ...acc, ...value }), {})),
      map((value) => ({ value }) as DynFormValue<TValue>),
    );
  }

  public override writeValue(value: DynFormValue<TValue> | undefined): void {
    for (const key in this.dynformGroupOptions) {
      const form: DynForm<TValue[keyof TValue], TData> = this.dynformGroupOptions[key];
      const childValue: TValue[keyof TValue] = value?.value[key] as TValue[keyof TValue];
      form.writeValue({ value: childValue } as DynFormValue<TValue[keyof TValue]>);
    }
  }
}

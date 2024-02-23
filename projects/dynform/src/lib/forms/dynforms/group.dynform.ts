import { BehaviorSubject, EMPTY, Observable, combineLatest, firstValueFrom, map, mergeMap } from 'rxjs';
import { UpdateValueFn, syncronizeValue } from '../../models/update-value.model';
import { DynFormValue } from '../../models/value.model';
import { and, or } from '../../operators/boolean.operator';
import { useFrom } from '../../operators/use.operator';
import { EditableDynForm, EditableDynFormOption } from './editable.dynform';

/**
 * Represents a group DynFormOption.
 */
export interface GroupDynFormOption<TValue, TData> {
  /**
   * The fields of the form.
   */
  fields: {
    [key in keyof TValue]: EditableDynForm<TValue[key], any>
  }
  /**
   * The fields of the form.
   */
  options: Omit<EditableDynFormOption<TValue, TData>, 'value'>;
}

/**
 * Represents a group DynForm.
 */
export class GroupDynForm<TValue, TData> extends EditableDynForm<TValue, TData>{
  /**
   * Buffer for the label of the form.
   *
   * @private
   * @type {(BehaviorSubject<string | undefined>)}
   * @memberof GroupDynForm
   */
  private readonly _label$$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  /**
   * Creates a new instance of GroupDynForm.
   * @param options Options to create a new GroupDynForm instance.
   */
  public constructor(
    protected readonly options: GroupDynFormOption<TValue, TData>
  ) {
    super({
      ...options.options,
      value: () => EMPTY,
      disable: or(
        options.options.disable,
        and(...Object.values<EditableDynForm<TValue[keyof TValue], any>>(options.fields as any)
          .map((field) => field.disable$)
          .map((disable$) => useFrom(disable$))
        )
      )
    });
  }

  /**
   * The value of the form.
   *
   * @memberof GroupDynForm
   */
  public override readonly value$: Observable<DynFormValue<TValue>> = this._label$$.pipe(
    mergeMap((label) => combineLatest(Object.entries(this.options.fields).map((entry) => {
      const key: keyof TValue = entry[0] as keyof TValue;
      const field: EditableDynForm<TValue[typeof key], any> = entry[1] as EditableDynForm<TValue[typeof key], any>;
      return field.value$.pipe(map(({value}) => ({ key, value })));
    })).pipe(
      map((entries) => entries.reduce((acc, entry) => ({ ...acc, [entry.key]: entry.value }), {} as TValue)),
      map((value) => ({ label, value }))
    )),
  );

  /**
   * The valid state of the form.
   *
   * @memberof GroupDynForm
   */
  public override readonly valid$: Observable<boolean> = combineLatest([
    this.validatorsErrors$.pipe(map((errors) => errors.length === 0)),
    ...Object.values<EditableDynForm<TValue[keyof TValue], any>>(this.options.fields as any).map((field) => field.valid$),
  ]).pipe(map((valids) => valids.every((valid) => valid)));

  /**
   * The disabled state of the form.
   *
   * @memberof GroupDynForm
   */
  public override readonly invalid$: Observable<boolean> = this.valid$.pipe(map((valid) => !valid));

  /**
   * Write the value of the form.
   * @param value The value to write.
   */
  public override writeValue(value: DynFormValue<TValue>): void {
    this.setLabel(value.label);
    const newValue: TValue = value.value;
    for (const key in newValue) {
      if (Object.prototype.hasOwnProperty.call(newValue, key)) {
        const value: DynFormValue<TValue[typeof key]> = { value: newValue[key] };
        this.options.fields[key].writeValue(value);
      }
    }
  }

  /**
   * Set the label of the form.
   * @param label The label to set.
   */
  public setLabel(label: string | undefined): void {
    this._label$$.next(label);
  }

  /**
   * Update the label of the form.
   * @param updateFn The function to update the label.
   */
  public async updateLabel(updateFn: UpdateValueFn<string | undefined>): Promise<void> {
    const currentLabel: string | undefined = await firstValueFrom(this._label$$.asObservable());
    const newLabel: string | undefined = await syncronizeValue(updateFn, currentLabel);
    this.setLabel(newLabel);
  }
}

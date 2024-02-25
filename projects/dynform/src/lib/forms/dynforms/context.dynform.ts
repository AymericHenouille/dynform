import { BehaviorSubject, Observable, concatMap, filter, firstValueFrom } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { DynOperation } from '../../models/dynoperation.model';
import { UpdateValueFn, syncronizeValue } from '../../models/update-value.model';

/**
 * Represents a DynForm with a context.
 *
 * @template TValue The type of the value.
 * @template TData The type of the data.
 */
export class ContextDynForm<TValue, TData> {
  /**
   * Buffer for the context.
   *
   * @private
   * @type {(BehaviorSubject<DynContext<TValue, TData> | undefined>)}
   * @memberof ContextDynForm
   */
  private _context$$: BehaviorSubject<DynContext<TValue, TData> | undefined> = new BehaviorSubject<DynContext<TValue, TData> | undefined>(undefined);
  /**
   * The context of the form.
   *
   * @readonly
   * @type {Observable<DynContext<TValue, TData> | undefined>}
   * @memberof ContextDynForm
   */
  public readonly context$: Observable<DynContext<TValue, TData>> = this._context$$.pipe(
    filter((context: DynContext<TValue, TData> | undefined): context is DynContext<TValue, TData> => context !== undefined),
  );

  /**
   * Use the context to operate on the form.
   * @param operation The operation to perform on the form.
   * @returns The result of the operation.
   */
  protected operate<TOperation>(operation: DynOperation<TValue, TData, TOperation>): Observable<TOperation> {
    return this.context$.pipe(
      concatMap((context: DynContext<TValue, TData>) => operation(context)),
    );
  }

  /**
   * Sets the context of the form.
   * @param context The context of the form.
   */
  public setContext(context: DynContext<TValue, TData>): void {
    this._context$$.next(context);
  }

  /**
   * Updates the context of the form.
   * @param updateFn The function to update the context.
   * @returns A promise that resolves when the context has been updated.
   */
  public async updateContext(updateFn: UpdateValueFn<DynContext<TValue, TData>>): Promise<void> {
    const currentValue: DynContext<TValue, TData> | undefined = await firstValueFrom(this.context$);
    const newValue: DynContext<TValue, TData> | undefined = await syncronizeValue(updateFn, currentValue);
    this.setContext(newValue);
  }

  /**
   * Patches the context of the form.
   * @param patch The patch to apply to the context.
   * @returns A promise that resolves when the context has been patched.
   */
  public patchContext(patch: Partial<DynContext<TValue, TData>>): Promise<void> {
    return this.updateContext((currentValue) => Object.assign({}, currentValue, patch));
  }
}

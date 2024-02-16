import { BehaviorSubject, Observable, concatMap, filter } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { DynOperation } from '../../models/dynoperation.model';

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
      concatMap((context) => operation(context)),
    );
  }

  /**
   * Sets the context of the form.
   * @param context The context of the form.
   */
  public setContext(context: DynContext<TValue, TData>): void {
    this._context$$.next(context);
  }
}

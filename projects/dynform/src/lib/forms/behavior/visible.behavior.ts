import { ElementRef } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { EditableDynForm } from '../dynforms/editable.dynform';
import { Behavior } from './behavior.model';

/**
 * Visible behavior
 * This behavior is used to show or hide a dynform. and update the data of the dynform.
 */
export class VisibleBehavior<TValue, TData> implements Behavior<EditableDynForm<TValue, TData>> {
  /**
   * The subscription to the visible observable.
   *
   * @private
   * @type {Subscription}
   * @memberof VisibleBehavior
   */
  private _visibleSubscription!: Subscription;

  /**
   * Creates a new instance of VisibleBehavior.
   */
  public constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
  ) { }

  /**
   * Bind the behavior
   * @param dynForm The dynform to create the behavior.
   */
  public bind(dynForm: EditableDynForm<TValue, TData>): void {
    this._visibleSubscription = dynForm.visible$.pipe(
      map((visible) => visible ? '' : 'none')
    ).subscribe((display) => this.elementRef.nativeElement.style.display = display);
  }

  /**
   * Dispose the behavior
   */
  public dispose(): void {
    this._visibleSubscription?.unsubscribe();
  }
}

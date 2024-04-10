/**
 * Behavior interface
 */
export interface Behavior<T> {
  /**
   * Bind the behavior
   */
  bind(dynForm: T): void;
  /**
   * Dispose the behavior
   */
  dispose(): void;
}

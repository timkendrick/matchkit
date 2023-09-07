/**
 * Wrapper that swaps between two values to avoid unnecessary allocations
 * @param T Inner value type
 */
export class DoubleBuffer<T> {
  private left: T;
  private right: T;
  private swapped: boolean = false;

  /**
   * @param T Inner value type
   * @param left Initially-active value
   * @param right Initially-inactive value
   */
  public constructor(left: T, right: T) {
    this.left = left;
    this.right = right;
  }

  /**
   * Get the currently-active value
   * @returns Currently-active value
   */
  public current(): T {
    const { left, right, swapped } = this;
    return swapped ? right : left;
  }

  /**
   * Get the currently-inactive value
   * @returns Currently-inactive value
   */
  public next(): T {
    const { left, right, swapped } = this;
    return swapped ? left : right;
  }

  /**
   * Swap the currently-active value
   * @returns Newly-active value
   */
  public swap(): T {
    this.swapped = !this.swapped;
    return this.current();
  }
}

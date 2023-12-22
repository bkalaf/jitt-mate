import { comparableToEquatable } from './comparableToEquatable';
import { curr } from './curr';
import { createComparable } from './createComparable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createEqualTo<T, U>(extractor: (x: T) => U, comp: (x: U, y: U) => CompareResult = (x: any, y: any) => (x < y ? -1 : x > y ? 1 : 0)) {
    const c1 = curr(createComparable)([extractor, comp]);
    return comparableToEquatable(c1);
}

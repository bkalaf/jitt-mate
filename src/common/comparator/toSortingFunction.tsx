import { uncurry } from '../functions/uncurry';
import { compR } from '../functions/composeR';
import { curr } from './curr';
import { createComparable } from './createComparable';

export function toSortingFunction<T>() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return compR(curr(createComparable<T, any>))(uncurry);
}

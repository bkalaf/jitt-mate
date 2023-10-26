import { uncurry } from '../functions/uncurry';
import { composeR } from '../functions/composeR';
import { curr, createComparable } from './areRealmObjectsEqual';


export function toSortingFunction<T>() {
    return composeR(curr((createComparable<T, any>)))(uncurry);
}

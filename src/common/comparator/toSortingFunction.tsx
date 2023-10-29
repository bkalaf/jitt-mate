import { uncurry } from '../functions/uncurry';
import { compR } from '../functions/composeR';
import { curr, createComparable } from './areRealmObjectsEqual';


export function toSortingFunction<T>() {
    return compR(curr((createComparable<T, any>)))(uncurry);
}

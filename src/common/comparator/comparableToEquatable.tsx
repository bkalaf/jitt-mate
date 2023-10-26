import { isEqual } from './areRealmObjectsEqual';
import { composeR } from '../functions/composeR';

export function comparableToEquatable<T>(comparable: IComparable<T>): IEquatable<T> {
    return function (left: T) {
        return composeR(comparable(left))(isEqual);
    };
}

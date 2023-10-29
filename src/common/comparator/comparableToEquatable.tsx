import { isEqual } from './areRealmObjectsEqual';
import { compR } from '../functions/composeR';

export function comparableToEquatable<T>(comparable: IComparable<T>): IEquatable<T> {
    return function (left: T) {
        return compR(comparable(left))(isEqual);
    };
}

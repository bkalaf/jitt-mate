import { flip } from '../../common/flip';


export function ifAny<T>(...arr: T[]) {
    return function (pred: (x: T) => (x: T) => boolean) {
        return function (item: T) {
            return arr.some(pred(item));
        };
    };
}

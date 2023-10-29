import { identity } from './identity';

export function compR<T, U>(f: (x: T) => U) {
    return function <V>(g: (x: U) => V) {
        return function (item: T) {
            return g(f(item));
        };
    };
}


export function composeR<T extends AnyArray>(...funcs: T) {
    return (x: Parameters<T[0]>[0]): ReturnType<Last<T>> => funcs.reduce((pv, cv) => compR(pv)(cv), identity)(x)
}
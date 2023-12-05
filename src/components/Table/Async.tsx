import { compR, composeR } from '../../common/functions/composeR';

export type Func<T, U> = (x: T) => U;
export type Async<T> = Promise<T>;
export type LiftFunction<T> = (x: T) => Async<T>;
export type ChainFunction<T, U> = (f: Func<T, Async<U>>, x: Async<T>) => Async<U>;
export type ApplyFunction<T, U> = (f: Async<Func<T, U>>, x: Async<T>) => Async<U>;

const of = function<T>(x: T) { return Promise.resolve(x) as Async<T>; }
const bind = function<T, U>(f: (x: T) => Async<U>, x: Async<T>) {
    return x.then(f) as Async<U>;
}
const ap = function<T, U>(f: Async<(x: T) => U>, x: Async<T>) {
    return bind(fprime => {
        return bind((xprime: T) => {
            return of(fprime(xprime))
        }, x)
    }, f)
}
const fmap = function<T, U>(f: (x: T) => U, x: Async<T>) {
    return ap(of(f), x);
}
export const Async = {
    of,
    bind,
    ap,
    fmap    
}

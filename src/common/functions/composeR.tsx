export function composeR<T, U>(f: (x: T) => U) {
    return function <V>(g: (x: U) => V) {
        return function (item: T) {
            return g(f(item));
        };
    };
}

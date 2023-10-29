export function flip<T, U, V>(func: (x: T) => (y: U) => V) {
    return function (x: U) {
        return function (y: T) {
            return func(y)(x);
        };
    };
}

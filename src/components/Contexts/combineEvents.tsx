
export function combineEvents<T, U>(f: (x: T) => U, g: (x: T) => U) {
    return (value: T) => {
        f(value);
        g(value);
    };
}

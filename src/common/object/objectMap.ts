export function objectMap<T, U>(func: (x: T) => U) {
    return function (obj: Record<string, T>) {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
    };
}

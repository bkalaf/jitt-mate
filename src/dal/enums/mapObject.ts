
export function mapObject<T, U>(obj: Record<string, T>) {
    return function (func: (x: T) => U) {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)] as [string, U]));
    };
}

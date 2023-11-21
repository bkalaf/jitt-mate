/* eslint-disable @typescript-eslint/no-explicit-any */
export function not<T>(predicate: (x: T) => boolean) {
    return function (item?: any) {
        return !predicate(item);
    };
}

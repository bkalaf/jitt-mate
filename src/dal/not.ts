export function not<T>(predicate: (x: T) => boolean) {
    return function (item?: any) {
        return !predicate(item);
    };
}


export function not<T>(predicate: Predicate<T>) {
    return function (item?: any) {
        return !predicate(item);
    };
}

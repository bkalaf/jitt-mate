export function either<T>(predicate1: Predicate<T>) {
    return function (predicate2: Predicate<T>) {
        return function (item: T) {
            return predicate1(item) ? true : predicate2(item);
        };
    };
}

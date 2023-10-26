export function both<T>(predicate1: Predicate<T>) {
    return function (predicate2: Predicate<T>) {
        return function (item: T) {
            return predicate1(item) ? predicate2(item) : false;
        };
    };
}

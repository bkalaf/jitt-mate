export function opposite<T>(predicate: Predicate<T>): Predicate<T> {
    return (value: T) => !predicate(value);
}

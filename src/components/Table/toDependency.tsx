export function toEnableDependency<T>(key: string, predicate: Predicate<T>): IDependency {
    return ['enable', key, predicate];
}

export function toDisableDependency(key: string, predicate: Predicate<T>): IDependency {
    return ['disable', key, predicate];
}
export function convertToLookup<TKey extends string, TValue>(record: Record<TKey, TValue>, extraKey?: keyof TValue) {
    return function (key?: TKey) {
        const first = key != null ? record[key] : undefined;
        return key != null ? (extraKey != null ? (first != null ? first[extraKey] : undefined) : record[key]) : undefined;
    };
}

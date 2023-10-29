export function convertToLookup<TKey extends string, TValue>(record: Record<TKey, TValue>) {
    return function (key: TKey) {
        return record[key];
    };
}

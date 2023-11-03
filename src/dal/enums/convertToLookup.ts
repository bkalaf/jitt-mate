export function convertToLookup<TKey extends string, TValue>(record: Record<TKey, TValue>, extraKey?: keyof TValue) {
    return function (key?: TKey) {
        return key != null ? extraKey != null ? record[key][extraKey] : record[key] : undefined;    
    };
}

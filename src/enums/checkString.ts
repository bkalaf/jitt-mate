export function checkString<T>(value: string | undefined | null, func: (str: string) => T): T | [undefined, undefined] {
    if (value != null && value.length > 0) return func(value);
    return [undefined, undefined];
}

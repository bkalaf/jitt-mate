export function toKVP(key: string) {
    return function (value: string | number | undefined | null) {
        if (value != null) {
            if (typeof value === 'string') {
                return value.length > 0 ? [key, value].join(': ') : undefined;
            }
            if (Number.isInteger(value)) {
                return [key, value.toFixed(0)].join(': ');
            }
            return [key, value.toFixed(2)].join(': ');
        }
        return undefined;
    };
}

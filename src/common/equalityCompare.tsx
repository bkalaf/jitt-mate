export function equalityCompare<T>(a: T, b: T) {
    if (typeof a === typeof b) {
        switch (typeof a) {
            case 'bigint':
            case 'number':
            case 'string':
            case 'boolean':
                return a === b;
            case 'symbol':
                return a === b;
            case 'undefined':
                return true;
            case 'function':
                return false;
            case 'object': {
                if (Array.isArray(a) && Array.isArray(b)) {
                    if (a.length === b.length) {
                        return a.every((x, ix) => a[ix] === b[ix]);
                    }
                    return false;
                } else if (a == null && b == null) {
                    return true;
                } else if (a == null || b == null) {
                    return false;
                }
                const keys1 = Object.keys(a);
                const keys2 = Object.keys(b);
                return keys1.length == keys2.length && keys1.every((x) => keys2.includes(x));
            }

            default:
                return false;
        }
    }
    return false;
}

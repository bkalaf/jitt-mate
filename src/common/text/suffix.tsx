export function suffix(suff: string) {
    return function (value?: string) {
        return value != null ? [value, suff].join('') : value;
    };
}


export function toFixed(precision: number) {
    return function (n: number) {
        return n.toFixed(precision);
    };
}

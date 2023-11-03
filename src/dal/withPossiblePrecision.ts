
export function withPossiblePrecision(x: number, precision?: number) {
    return precision ? x.toFixed(precision) : x.toString();
}

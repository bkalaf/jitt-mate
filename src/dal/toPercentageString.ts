import { ofNumber } from './ofNumber';
import { withPossiblePrecision } from './withPossiblePrecision';

export function toPercentageString(x?: StringOr<number>, precision?: number) {
    const n = ofNumber(x);
    return n != null ? `${withPossiblePrecision(n, precision)}%` : undefined;
}

export function ofBarcode(x?: string): string | undefined {
    return x == null ? undefined : x.padStart(12, '0');
}

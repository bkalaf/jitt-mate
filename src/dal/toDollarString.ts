import { withPossiblePrecision } from './withPossiblePrecision';
import { is } from './is';
import { ofNumber } from './ofNumber';

export function toDollarString(x?: StringOr<number>) {
    const n = ofNumber(x);
    return n != null ? `${withPossiblePrecision(n, 2)}` : undefined;
}

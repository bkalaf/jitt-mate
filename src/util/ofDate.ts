import { is } from '../dal/is';

export function ofDate(x?: StringOr<number | Date>) {
    if (x == null) return undefined;
    if (is.string(x)) {
        try {
            return new Date(Date.parse(x));
        } catch (error) {
            console.error(`bad parse of: ${x}`);
            alert('bad parse');
            return undefined;
        }
    }
    if (is.number(x)) return new Date(x);
    return x;
}

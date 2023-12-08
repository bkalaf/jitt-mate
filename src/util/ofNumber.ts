import { is } from '../dal/is';

export function ofNumber(x?: StringOr<number>) {
    try {
        return x == null ? undefined : is.string(x) ? parseInt(x, 10) : x;
    } catch (error) {
        try {
            return parseFloat(x as string);
        } catch (error) {
            console.error(`bad parse: ${x}`);
            alert('bad parse');
            throw error;
        }
    }
}

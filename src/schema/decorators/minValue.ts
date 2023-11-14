import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function minValue(min: number) {
    return wrappedSetMetadata('min', 0);
}

import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function optional() {
    return wrappedSetMetadata('isOptional', true);
}


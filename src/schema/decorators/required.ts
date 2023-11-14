import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function required() {
    return wrappedSetMetadata('isOptional', false);
}

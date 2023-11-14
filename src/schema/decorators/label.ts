import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function label(displayName?: string) {
    return wrappedSetMetadata('displayName', displayName);
}

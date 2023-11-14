import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function indexed() {
    return wrappedSetMetadata('indexed', true);
}

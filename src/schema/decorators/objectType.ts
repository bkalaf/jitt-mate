import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function objectType(ot: RealmObjects) {
    return wrappedSetMetadata('objectType', ot);
}

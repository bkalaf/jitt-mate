import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function datatype(datatype: RealmTypes) {
    return wrappedSetMetadata('datatype', datatype);
}

import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';


export function columnName(name: string) {
    return wrappedSetMetadata('name', name);
}

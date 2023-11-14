import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';


export function accessorKey<T extends EntityBase>(name: keyof T) {
    return wrappedSetMetadata('accessorKey', name);
}

import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function tooltip<T extends EntityBase>(func: (x: T) => string) {
    return wrappedSetMetadata('tooltip', func);
}

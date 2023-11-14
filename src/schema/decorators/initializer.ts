import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function initializer(func: () => Promise<any>) {
    return wrappedSetMetadata('initializer', func);
}

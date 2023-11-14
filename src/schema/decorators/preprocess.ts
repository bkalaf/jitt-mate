import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function preprocess(func: (x: any) => string) {
    return wrappedSetMetadata('preProcess', func);
}

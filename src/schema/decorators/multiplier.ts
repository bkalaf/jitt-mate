import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';


export function multiplier(multiplier: number) {
    return wrappedSetMetadata('mulitplier', multiplier);
}

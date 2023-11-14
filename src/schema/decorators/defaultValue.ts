import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export function withDefaultValueDecorator(defValue: any) {
    return wrappedSetMetadata('defaultValue', defValue);
}

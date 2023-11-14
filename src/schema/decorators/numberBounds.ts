import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { composeDecorators } from '../composeDecorators';


export const numberBounds = (values: { min?: number; max?: number; }) => {
    if (values.min != null && values.max != null) return composeDecorators(wrappedSetMetadata('min', values.min), wrappedSetMetadata('max', values.max));
    if (values.min != null) return wrappedSetMetadata('min', values.min);
    if (values.max != null) return wrappedSetMetadata('max', values.max);
};

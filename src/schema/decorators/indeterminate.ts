import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';

export const indeterminate = () => wrappedSetMetadata('isDeterminate', false);

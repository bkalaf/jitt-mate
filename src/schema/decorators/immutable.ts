import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';


export const immutable = () => wrappedSetMetadata('readonly', true);

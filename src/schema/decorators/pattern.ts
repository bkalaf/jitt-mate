import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';


export const pattern = (patt: RegExp | string) => wrappedSetMetadata('pattern', patt instanceof RegExp ? patt.toString().slice(1, patt.toString().length - 2) : patt);
